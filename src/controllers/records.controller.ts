import { Request, Response } from "express";
import { sheets } from "../google/sheets";
import { v4 as uuid } from "uuid";

function getSpreadsheetId(res?: Response) {
  const id = process.env.SPREADSHEET_ID;

  if (!id && res) {
    res.status(500).json({
      error: "SPREADSHEET_ID não definido no ambiente",
    });
  }

  return id;
}

export async function createRecord(req: Request, res: Response) {
  const SPREADSHEET_ID = getSpreadsheetId(res);
  if (!SPREADSHEET_ID) return;

  const email = (req as any).user.email;

  const { emocao, insight, causas } = req.body;

  // validação mínima
  if (!Array.isArray(causas)) {
    return res.status(400).json({ error: "Formato de causas inválido" });
  }
  const causasSanitizadas = causas.map((c) => ({
    causaId: c.causaId.trim(),
    nota: c.nota,
    subcausas: c.subcausas.map((s: string) => s.trim()),
    textoLivre: c.textoLivre,
  }));

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Registros!A:G",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          uuid(), // RegistroId
          email, // EmailUsuario
          new Date().toISOString(), // Data
          "modulo_atual", // ModuloId (ver nota abaixo)
          emocao ?? "",
          insight ?? "",
          JSON.stringify(causasSanitizadas)
        ],
      ],
    },
  });

  res.status(201).json({ message: "Registro criado com sucesso" });
}

export async function listMyRecords(req: Request, res: Response) {
  const SPREADSHEET_ID = getSpreadsheetId(res);
  if (!SPREADSHEET_ID) return;

  const email = (req as any).user.email;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Registros!A2:G",
  });

  const rows = response.data.values || [];

  const records = rows
    .filter((row) => row[1] === email)
    .map((row) => ({
      id: row[0],
      email: row[1],
      createdAt: row[2],
      moduloId: row[3],
      emocao: row[4],
      insight: row[5],
      causas: row[6] ? JSON.parse(row[6]) : [],
    }));

  res.json(records);
}
