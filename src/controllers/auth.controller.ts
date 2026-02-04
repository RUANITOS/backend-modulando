import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../repositories/users.repository";

const JWT_SECRET_ENV = process.env.JWT_SECRET;

if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET não definido");
}

const JWT_SECRET: string = JWT_SECRET_ENV;

export async function login(req: Request, res: Response) {
  const { email, cpf, nome, dataNascimento } = req.body;

  if (!email || !cpf) {
    return res.status(400).json({ error: "Email e CPF são obrigatórios" });
  }

  let user = await findUserByEmail(email);

  if (!user) {
    user = await createUser(email, nome ?? "", cpf, dataNascimento ?? "");
  } else if (user.cpf !== cpf) {
    return res.status(401).json({ error: "CPF inválido" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      nome: user.nome,
    },
  });
}

export async function checkEmail(req: Request, res: Response) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email inválido" });
  }

  const user = await findUserByEmail(email);

  return res.json({
    exists: !!user,
    nome: user?.nome ?? null,
  });
}
