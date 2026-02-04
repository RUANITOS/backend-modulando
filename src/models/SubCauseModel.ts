import { Schema, model, Types } from "mongoose";

const SubCauseSchema = new Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String },
    sheetId: { type: String, required: true },
    causeId: { type: Types.ObjectId, ref: "Cause", required: true },
    moduleId: { type: Types.ObjectId, ref: "Module", required: true },
  },
  { timestamps: true }
);

export const SubCauseModel = model("SubCause", SubCauseSchema);
