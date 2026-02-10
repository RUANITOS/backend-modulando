import mongoose from "mongoose";
import { CauseModel } from "../models/CauseModel";

async function seedCauses() {
  await mongoose.connect("mongodb+srv://ruanguilhermesiq_db_user:xQZ28fOs7ym4UI98@cluster0.71pzndb.mongodb.net/");

  const causes = [
    {
      sheetId: "FIS",
      nome: "Físico",
      descricao: "Corpo, postura, dores e saúde física",
      maxSubcausas: 5,
    },
    {
      sheetId: "ENE",
      nome: "Energético",
      descricao: "Nível de energia, disposição e vitalidade",
      maxSubcausas: 5,
    },
    {
      sheetId: "EMI",
      nome: "Emocional",
      descricao: "Emoções, sentimentos e estados emocionais",
      maxSubcausas: 5,
    },
    {
      sheetId: "MEN",
      nome: "Mental",
      descricao: "Pensamentos, foco, clareza e crenças",
      maxSubcausas: 5,
    },
    {
      sheetId: "ESP",
      nome: "Espiritual",
      descricao: "Propósito, sentido de vida e conexão",
      maxSubcausas: 5,
    },
  ];

  for (const cause of causes) {
    await CauseModel.updateOne(
      { sheetId: cause.sheetId },
      { $setOnInsert: cause },
      { upsert: true }
    );
  }

  console.log("✅ Causas POSTURA 5D inseridas com sucesso");
  process.exit();
}

seedCauses();
