import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // funciona local e no Render

import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/records.routes";
import moduleRoutes from "./routes/modules.routes";
import { connectMongo } from "./database/mongo";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/modules", moduleRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 🔥 PORTA OBRIGATÓRIA PARA O RENDER
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // 🍃 Conecta no Mongo ANTES de subir o servidor
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

bootstrap();
