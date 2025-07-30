export interface MovimientoDTO {
  Banco: string;
  Cuenta: string;
  Fecha: string;
  DescMot: string;
  ValorTotal: number;
}

export interface Egreso {
  BANCO?: string;
  NROCTA?: string;
  CUENTA?: string;
  FECHA: string;
  VALOR: number;
  NOTA?: string;
}
