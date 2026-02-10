// models/User.ts
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  nome: { type: String },
  email: { type: String, unique: true, required: true },
  cpf: { type: String },
  dataNascimento: { type: String },

  passwordHash: {
    type: String,
    required: false,
  },

  firstAccessCompleted: {
    type: Boolean,
    default: false,
  },

  dataEntrada: { type: Date, default: Date.now },
});

export const User = model("User", UserSchema);
