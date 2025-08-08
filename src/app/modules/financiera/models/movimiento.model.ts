import { Egreso } from "./egreso.model";

export type Banco = 'Davivienda' | 'Bancolombia';

export interface MovimientoDTO {
  Banco: Banco;
  Cuenta: string;     // 10..N dígitos normalizados
  Fecha: string;      // ISO yyyy-MM-dd
  DescMot: string;
  ValorTotal: number; // signo natural del banco
}

export interface ReconciliacionParams {
  tolerancia?: number;          // en unidades monetarias, p.ej. 0.01
  invertirSignoEgresos?: boolean;
}

export interface ReconciliacionResult {
  faltanEnDocumentos: Egreso[];
  faltanEnEgresos: MovimientoDTO[];
}
