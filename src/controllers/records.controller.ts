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

  const {
    modulo,

    // antigo
    presenca,
    energia,
    clareza,
    compromisso,

    // novo 5D
    fisico,
    energetico,
    emocional5d,
    mental,
    espiritual,

    emocao,
    insight,
  } = req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Registros!A:O",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          uuid(),
          email,
          new Date().toISOString(),
          modulo,

          // antigo
          presenca ?? "",
          energia ?? "",
          clareza ?? "",
          compromisso ?? "",
          emocao ?? "",
          insight ?? "",

          // novo 5D
          fisico ?? "",
          energetico ?? "",
          emocional5d ?? "",
          mental ?? "",
          espiritual ?? "",
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
    range: "Registros!A2:O",
  });

  const rows = response.data.values || [];

  const records = rows
    .filter((row) => row[1] === email)
    .map((row) => ({
      id: row[0],
      email: row[1],
      createdAt: row[2],
      modulo: row[3],

      // antigo
      presenca: row[4] ? Number(row[4]) : undefined,
      energia: row[5] ? Number(row[5]) : undefined,
      clareza: row[6] ? Number(row[6]) : undefined,
      compromisso: row[7] ? Number(row[7]) : undefined,
      emocao: row[8],
      insight: row[9],

      // novo 5D
      fisico: row[10] ? Number(row[10]) : undefined,
      energetico: row[11] ? Number(row[11]) : undefined,
      emocional5d5d: row[12] ? Number(row[12]) : undefined,
      mental: row[13] ? Number(row[13]) : undefined,
      espiritual: row[14] ? Number(row[14]) : undefined,
    }));
  res.json(records);
}
