import { sheets } from "../google/sheets";
import { v4 as uuid } from "uuid";

const RANGE = "Usuarios!A2:D";

function getSpreadsheetId() {
  const id = process.env.SPREADSHEET_ID;
  if (!id) {
    throw new Error("SPREADSHEET_ID não definido");
  }
  return id;
}

export async function findUserByEmail(email: string) {
  const SPREADSHEET_ID = getSpreadsheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = response.data.values || [];

  const row = rows.find((r) => r[2] === email);

  if (!row) return null;

  return {
    id: row[0],
    nome: row[1],
    email: row[2],
    dataEntrada: row[3],
  };
}

export async function createUser(email: string, nome = "") {
  const SPREADSHEET_ID = getSpreadsheetId();

  console.log("🧪 createUser chamado para:", email);

  const id = uuid();
  const dataEntrada = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Usuarios!A:D",
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, nome, email, dataEntrada]],
    },
  });

  console.log("✅ Usuário criado no Sheets:", email);

  return {
    id,
    nome,
    email,
    dataEntrada,
  };
}
