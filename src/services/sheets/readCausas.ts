import { sheets } from "../../google/sheets";

export async function readCausas() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID!,
    range: "causas!A2:E",
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[4] === "TRUE")
    .map((row) => ({
      id: row[0],
      nome: row[1],
      descricao: row[2],
      maxSubcausas: Number(row[3] ?? 0),
    }));
}
