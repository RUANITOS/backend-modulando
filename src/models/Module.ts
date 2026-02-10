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
  causeIds: [{ type: Schema.Types.ObjectId, ref: "Cause" }],
});

export const Module = model("Module", ModuleSchema);
