import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET_ENV = process.env.JWT_SECRET;

if (!JWT_SECRET_ENV) {
  throw new Error("JWT_SECRET não definido no ambiente");
}

// 🔒 Agora o TypeScript SABE que é string
const JWT_SECRET: string = JWT_SECRET_ENV;

interface AppJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      !("email" in decoded)
    ) {
      return res.status(401).json({ error: "Token inválido" });
    }

    (req as any).user = decoded as AppJwtPayload;

    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
