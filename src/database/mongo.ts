// src/database/mongo.ts
import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI não definido");
  }

  await mongoose.connect(uri);
  console.log("🍃 MongoDB conectado");
}
