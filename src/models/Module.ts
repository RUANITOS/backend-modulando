// models/Module.ts
import { Schema, model } from "mongoose";

const SubcausaSchema = new Schema({
  nome: String,
  observavel: Boolean,
});

const CausaSchema = new Schema({
  causaId: String,
  nome: String,
  subcausas: [SubcausaSchema],
});

const ModuleSchema = new Schema({
  nome: String,
  dataInicio: Date,
  dataFim: Date,
  descricao: String,
  causas: [CausaSchema],
});

export const Module = model("Module", ModuleSchema);
