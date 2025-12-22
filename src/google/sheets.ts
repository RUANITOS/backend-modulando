import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({
  version: "v4",
  auth,
});