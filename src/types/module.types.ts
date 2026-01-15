export type Subcausa = {
  id: string;
  nome: string;
};

export type Causa = {
  id: string;
  nome: string;
  descricao?: string;
  maxSubcausas: number;
  subcausas: Subcausa[];
};

export type ModuloConfig = {
  id: string;
  nome: string;
  causas: Causa[];
};
