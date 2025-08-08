export interface Egreso {
  BANCO?: string;
  NROCTA?: string;
  CUENTA?: string;
  FECHA: string; // ISO o yyyy-MM-dd
  VALOR: number; // suele venir positivo
  NOTA?: string;
}
