import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../repositories/users.repository";

const JWT_SECRET_ENV = process.env.JWT_SECRET;

if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET não definido no ambiente");
}

const JWT_SECRET: string = JWT_SECRET_ENV;


export async function login(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email obrigatório" });
  }

  let user = await findUserByEmail(email);

  if (!user) {
    user = await createUser(email);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user,
  });
}
