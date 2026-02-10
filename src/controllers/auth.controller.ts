import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repositories/users.repository";
import bcrypt from "bcryptjs";

const JWT_SECRET_ENV = process.env.JWT_SECRET;

if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET não definido");
}

const JWT_SECRET: string = JWT_SECRET_ENV;

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email e senha são obrigatórios",
    });
  }

  const user = await findUserByEmail(email);

  if (!user || !user.passwordHash) {
    return res.status(401).json({
      error: "Credenciais inválidas",
    });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({
      error: "Credenciais inválidas",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
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

  if (!user) {
    return res.json({
      exists: false,
    });
  }

return res.json({
  exists: true,
  firstAccess: !user.firstAccessCompleted,
  nome: user.nome ?? null,
});
}
export async function firstAccess(req: Request, res: Response) {
  const { email, nome, cpf, dataNascimento, password, confirmPassword } =
    req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Dados obrigatórios ausentes",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "As senhas não conferem",
    });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      error:
        "Este email não foi encontrado em nossa base de dados. Em caso de dúvidas, entre em contato com o suporte.",
    });
  }

  if (user.firstAccessCompleted) {
    return res.status(400).json({
      error: "Usuário já completou o primeiro acesso",
    });
  }

  user.nome = nome;
  user.cpf = cpf;
  user.dataNascimento = dataNascimento;
  user.passwordHash = await bcrypt.hash(password, 10);
  user.firstAccessCompleted = true;

  await user.save();

  return res.json({ success: true });
}

