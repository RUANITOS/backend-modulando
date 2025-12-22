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
  const { modulo, presenca, energia, clareza, compromisso, emocao, insight } =
    req.body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Registros!A:J",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        uuid(),
        email,
        new Date().toISOString(),
        modulo,
        presenca,
        energia,
        clareza,
        compromisso,
        emocao,
        insight,
      ]],
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
    range: "Registros!A2:J",
  });

  const rows = response.data.values || [];

  const records = rows
    .filter((row) => row[1] === email)
    .map((row) => ({
      id: row[0],
      email: row[1],
      data: row[2],
      modulo: row[3],
      presenca: row[4],
      energia: row[5],
      clareza: row[6],
      compromisso: row[7],
      emocao: row[8],
      insight: row[9],
    }));

  res.json(records);
}
