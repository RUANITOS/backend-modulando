import { Request, Response } from "express";
import { getModuloAtualConfig } from "../services/modulesReader";

export async function getModuloAtual(req: Request, res: Response) {
  const modulo = await getModuloAtualConfig();

  if (!modulo) {
    return res.status(404).json({ error: "Módulo não encontrado" });
  }

  res.json(modulo);
}
