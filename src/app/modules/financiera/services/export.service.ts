// src/app/modules/financiera/services/export.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MovimientoDTO } from '../models/movimiento.model';
import { Egreso } from '../models/egreso.model';

const HEADERS = ['Banco','Cuenta','Fecha','DescMot','ValorTotal'] as const;

function ensureSheet(data: MovimientoDTO[]): XLSX.WorkSheet {
  if (!data?.length) {
    const ws = XLSX.utils.aoa_to_sheet([HEADERS as unknown as string[]]);
    (ws as any)['!cols'] = (HEADERS as readonly string[]).map(h => ({ wch: Math.max(h.length + 2, 14) }));
    return ws;
  }
  const ws = XLSX.utils.json_to_sheet<MovimientoDTO>(data, { header: HEADERS as unknown as string[] });
  (ws as any)['!cols'] = (HEADERS as readonly string[]).map(h => ({ wch: Math.max(h.length + 2, 14) }));
  return ws;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportarConciliacion(faltanEnDocumentos: Egreso[], faltanEnEgresos: MovimientoDTO[]): void {
    const ws1 = ensureSheet(faltanEnDocumentos.map(r => ({
      Banco: (r.BANCO ?? '').toString().trim() as any,
      Cuenta: (r.NROCTA ?? r.CUENTA ?? '').toString().trim(),
      Fecha: (r.FECHA ?? '').toString().slice(0, 10),
      DescMot: (r.NOTA ?? '').toString().trim(),
      ValorTotal: Number(r.VALOR ?? 0),
    })));
    const ws2 = ensureSheet(faltanEnEgresos);

    const wb: XLSX.WorkBook = {
      SheetNames: ['Solo_en_Egresos', 'Solo_en_Bancos'],
      Sheets: { Solo_en_Egresos: ws1, Solo_en_Bancos: ws2 },
    };

    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const nombre = `conciliacion_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(new Blob([blob]), nombre);
  }
}
