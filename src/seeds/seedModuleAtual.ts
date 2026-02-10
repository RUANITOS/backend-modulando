import mongoose from "mongoose";
import { Module } from "../models/Module";

async function seedModuleAtual() {
  await mongoose.connect("mongodb+srv://ruanguilhermesiq_db_user:xQZ28fOs7ym4UI98@cluster0.71pzndb.mongodb.net/");

  const moduleData = {
    nome: "Sessão 3 - Vitalidade e Presença no Corpo: Voltar a Habitar-se",
    descricao:
      "Módulo focado em vitalidade, presença e reconexão com o corpo físico e energético.",
    dataInicio: new Date("2026-02-09"),
    dataFim: new Date("2026-02-19"),
  };

  await Module.updateOne(
    { nome: moduleData.nome },
    { $setOnInsert: moduleData },
    { upsert: true }
  );

  console.log("✅ Módulo atual inserido com sucesso");
  process.exit();
}

seedModuleAtual();
