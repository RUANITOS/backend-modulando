import { Request, Response } from "express";
import { DailyRecord } from "../models/DailyRecord";
import { Module } from "../models/Module";
import { CauseModel } from "../models/CauseModel";
import { getModuloAtualConfig } from "../services/modulesReader";
export async function createRecord(req: Request, res: Response) {
  const user = (req as any).user;
  const { emocao, insight, causas } = req.body;

  if (!Array.isArray(causas)) {
    return res.status(400).json({ error: "Formato de causas inválido" });
  }

  const modulo = await getModuloAtualConfig();
  if (!modulo) {
    return res.status(400).json({ error: "Nenhum módulo ativo" });
  }

  await DailyRecord.create({
    userId: user.userId,
    moduleId: modulo.id,
    emocao: emocao ?? "",
    insight: insight ?? "",
    causas,
  });

  return res.status(201).json({ message: "Registro criado com sucesso" });
}

export async function listMyRecords(req: Request, res: Response) {
  const user = (req as any).user;

  const records = await DailyRecord.find({
    userId: user.userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (records.length === 0) {
    return res.json([]);
  }

  // 🔎 Carrega dados auxiliares uma única vez
  const modules = await Module.find().lean();
  const causes = await CauseModel.find().lean();

  const moduleMap = new Map(modules.map((m) => [String(m._id), m.nome]));

  const causeMap = new Map(causes.map((c) => [String(c._id), c.nome.trim()]));

  return res.json(
    records.map((r) => ({
      registroId: r._id,
      email: user.email,
      data: r.createdAt, // 👈 o front usa `data`
      moduloId: moduleMap.get(String(r.moduleId)) ?? r.moduleId,
      emocao: r.emocao,
      insight: r.insight,
      causas: (r.causas ?? []).map((c: any) => ({
        causaId: causeMap.get(String(c.causaId)) ?? c.causaId,
        nota: c.nota,
        subcausas: c.subcausas ?? [],
        textoLivre: c.textoLivre ?? null,
      })),
    })),
  );
}
