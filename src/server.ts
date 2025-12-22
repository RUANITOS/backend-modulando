import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // funciona local e ignora no Render

import { sheets } from "./google/sheets";
import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/records.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 🔥 PORTA OBRIGATÓRIA PARA O RENDER
const PORT = process.env.PORT || 3000;

// 🚀 SÓ DEPOIS DE ESCUTAR A PORTA
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Teste do Sheets NÃO BLOQUEANTE
  try {
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID!,
    });

    console.log(
      "📄 Sheets conectado:",
      res.data.properties?.title
    );
  } catch (error) {
    console.error("❌ Erro ao conectar no Sheets:", error);
  }
});
