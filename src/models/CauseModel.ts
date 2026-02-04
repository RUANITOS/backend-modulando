import { Schema, model } from "mongoose";

const CauseSchema = new Schema(
  {
    sheetId: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    descricao: { type: String },
    maxSubcausas: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CauseModel = model("Cause", CauseSchema);