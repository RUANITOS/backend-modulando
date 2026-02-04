import { Request, Response } from "express";
import { CauseModel } from "../models/CauseModel";
import { CauseLean } from "../types/cause.types";

export async function getAllCauses(req: Request, res: Response) {
  const causes = (await CauseModel.find().lean()) as CauseLean[];

  res.json(
    causes.map((cause) => ({
      id: cause._id,
      nome: cause.nome.trim(),
      descricao: cause.descricao,
      maxSubcausas: cause.maxSubcausas,
      subcausas: (cause.subcausas ?? []).map((sub) => ({
        id: sub.causaId,
        nome: sub.nome,
      })),
    }))
  );
}
