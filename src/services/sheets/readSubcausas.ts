import { sheets } from "../../google/sheets";

export async function readSubcausas() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID!,
    range: "subcausas!A2:E",
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[4] === "TRUE")
    .map((row) => ({
      id: row[0],
      causaId: row[1],
      nome: row[2],
      descricao: row[3],
    }));
}
