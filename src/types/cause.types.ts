export type Subcausa = {
  nome: string;
  descricao?: string;
  causaId: string;
};

export type CauseLean = {
  _id: any;
  sheetId: string;
  nome: string;
  descricao?: string;
  maxSubcausas: number;
  subcausas?: Subcausa[]; // 👈 AGORA OPCIONAL
};
