import { BankStatementParser } from './parser.interface';
import { MovimientoDTO } from '../models/movimiento.model';
import { parseCSV } from '../utils/csv.utils';
import { parseMoneyFlexible } from '../utils/number.utils';
import { normalizarFecha8 } from '../utils/date.utils';

export class BancolombiaCsvParser implements BankStatementParser {
  readonly banco = 'Bancolombia' as const;

  canParse(_nameLower: string, ext: string): boolean {
    return ['csv', 'txt'].includes(ext); // algunos exportan .txt
  }

  async parse(file: File, _empresa: any, cuenta: string): Promise<MovimientoDTO[]> {
    const text = await file.text();
    const rows = parseCSV(text);
    // Asegura al menos 8 columnas (ajusta si el layout cambia)
    return rows
      .filter(c => c.length >= 8)
      .map(c => ({
        Banco: this.banco,
        Cuenta: cuenta,
        Fecha: normalizarFecha8(c[3]), // según tu layout original
        DescMot: (c[7] ?? '').trim(),
        ValorTotal: parseMoneyFlexible(c[5]),
      }));
  }
}
