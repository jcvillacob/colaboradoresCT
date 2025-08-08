import { Empresa } from '../config/cuentas.config';
import { Banco, MovimientoDTO } from '../models/movimiento.model';

export interface BankStatementParser {
  readonly banco: Banco;
  canParse(fileNameLower: string, ext: string): boolean;
  parse(file: File, empresa: Empresa, cuenta: string): Promise<MovimientoDTO[]>;
}
