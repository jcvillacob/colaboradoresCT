import * as XLSX from 'xlsx';
import { BankStatementParser } from './parser.interface';
import { MovimientoDTO } from '../models/movimiento.model';
import { fechaFromExcelValue } from '../utils/date.utils';
import { parseMoneyFlexible } from '../utils/number.utils';

export class DaviviendaExcelParser implements BankStatementParser {
  readonly banco = 'Davivienda' as const;

  canParse(nameLower: string, ext: string): boolean {
    return ['xls', 'xlsx'].includes(ext);
  }

  async parse(file: File, _empresa: any, cuenta: string): Promise<MovimientoDTO[]> {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array', cellDates: true });

    // 1a hoja con datos no vacía
    const name = wb.SheetNames.find(n => {
      const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets[n], { header: 1, defval: '', blankrows: false });
      return rows.length && rows.some(r => r.some(c => c !== ''));
    });
    if (!name) return [];

    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets[name], { header: 1, defval: '', blankrows: false });
    const cuerpo = rows.slice(2, Math.max(2, rows.length - 2)); // mismo recorte que usabas

    return cuerpo.map((r) => ({
      Banco: this.banco,
      Cuenta: cuenta,
      Fecha: fechaFromExcelValue(r[0]),
      DescMot: (r[7] ?? '').toString().trim(),
      ValorTotal: parseMoneyFlexible(r[8]),
    }));
  }
}
