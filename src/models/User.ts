// models/User.ts
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  nome: String,
  email: { type: String, unique: true, required: true },
  cpf: { type: String, required: true },
  dataNascimento: String,
  dataEntrada: { type: Date, default: Date.now },

  // novo (login/senha)
  passwordHash: { type: String },
});

export const User = model("User", UserSchema);
