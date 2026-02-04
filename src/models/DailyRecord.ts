// models/DailyRecord.ts
import { Schema, model, Types } from "mongoose";

const RecordSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  moduleId: { type: Types.ObjectId, ref: "Module", required: true },

  emocao: String,
  insight: String,

  causas: [
    {
      causaId: String,
      nota: Number,
      subcausas: [String],
      textoLivre: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

export const DailyRecord = model("DailyRecord", RecordSchema);
