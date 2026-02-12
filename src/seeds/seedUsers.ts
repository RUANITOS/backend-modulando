import mongoose from "mongoose";
import { User } from "../models/User";

async function seedUsers() {
  await mongoose.connect(
    "mongodb+srv://ruanguilhermesiq_db_user:xQZ28fOs7ym4UI98@cluster0.71pzndb.mongodb.net/",
  );

  const emails = [
    "ruanguilhermesiq@yahoo.com.br",
    "dr.cbsilva@gmail.com",
    "carlo_sanches@hotmail.com",
    "celutamara@yahoo.com.br",
    "ericalluque@gmail.com",
    "izoldemariaico@gmail.com",
    "lucilenelimacorrea@gmail.com",
    "luizsangali@uol.com.br",
    "marciacostamg@yahoo.com.br",
    "marapodo12@hotmail.com",
    "nancifar13@yahoo.com.br",
    "coord.infovesp@gmail.com",
    "agataclover@hotmail.com",
    "sergiooliveira.so991593@gmail.com",
    "Wandavcaron@yahoo.com.br",
    "pedromoreiradiluz@gmail.com",
    "bruna.russ@gmail.com",
  ];

  const results = {
    created: [] as string[],
    existing: [] as string[],
  };

  for (const email of emails) {
    const existing = await User.findOne({ email });

    if (existing) {
      results.existing.push(email);
      continue;
    }

    await User.create({
      email,
      firstAccessCompleted: false,
    });

    results.created.push(email);
  }

  console.log("Seed finalizada:");
  console.log("Criados:", results.created);
  console.log("Já existentes:", results.existing);

  process.exit(0);
}

seedUsers();
