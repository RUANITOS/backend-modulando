import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import { sheets } from "./google/sheets";

import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/records.routes";

console.log("ENV DEBUG:", process.env.SPREADSHEET_ID);

const app = express();
async function testSheets() {
  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.SPREADSHEET_ID!,
  });

  console.log("Sheets conectado:", res.data.properties?.title);
}

testSheets();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(3333, () => {
  console.log("🚀 Server running on http://localhost:3333");
});
