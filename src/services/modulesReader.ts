import { readCausas } from "./sheets/readCausas";
import { readSubcausas } from "./sheets/readSubcausas";
import { readModulos } from "./sheets/readModulos";
import { ModuloConfig } from "../types/module.types";

export async function getModuloAtualConfig(): Promise<ModuloConfig | null> {
  const [modulos, causas, subcausas] = await Promise.all([
    readModulos(),
    readCausas(),
    readSubcausas(),
  ]);

  const modulo = modulos[0];
  if (!modulo) return null;

  const causasComSub = causas.map((causa) => ({
    id: causa.id,
    nome: causa.nome,
    descricao: causa.descricao,
    maxSubcausas: causa.maxSubcausas,
    subcausas: subcausas
      .filter((s) => s.causaId === causa.id)
      .map((s) => ({
        id: s.id,
        nome: s.nome,
        descricao: s.descricao,
      })),
  }));

  return {
    id: modulo.id,
    nome: modulo.nome,
    causas: causasComSub,
  };
}
