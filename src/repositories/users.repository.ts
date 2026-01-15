import { sheets } from "../google/sheets";
import { v4 as uuid } from "uuid";

const RANGE = "Usuarios!A2:F";

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
    cpf: row[4], // ✅ coluna E
    dataNascimento: row[5], // ✅ coluna F
  };
}

export async function createUser(
  email: string,
  nome = "",
  cpf = "",
  dataNascimento = ""
) {
  const SPREADSHEET_ID = getSpreadsheetId();

  console.log("🧪 createUser chamado para:", email);

  const id = uuid();
  const dataEntrada = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Usuarios!A:F",
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, nome, email, dataEntrada, cpf, dataNascimento]],
    },
  });

  console.log("✅ Usuário criado no Sheets:", email);

  return {
    id,
    nome,
    email,
    dataEntrada,
    cpf,
    dataNascimento,
  };
}
