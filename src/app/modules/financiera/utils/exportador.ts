import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MovimientoDTO, Egreso } from '../models/movimiento.dto';

export function exportarConciliacionAExcel(faltanEnDocumentos: Egreso[], faltanEnEgresos: MovimientoDTO[]): void {
  const mapRowE = (r: Egreso): MovimientoDTO => ({
    Banco: (r.BANCO ?? '').toString().trim(),
    Cuenta: (r.NROCTA ?? '').toString().trim(),
    Fecha: (r.FECHA ?? '').slice(0, 10),
    DescMot: (r.NOTA ?? '').toString().trim(),
    ValorTotal: Number(r.VALOR ?? 0),
  });

  const headers: (keyof MovimientoDTO)[] = ['Banco', 'Cuenta', 'Fecha', 'DescMot', 'ValorTotal'];

  const ws1 = XLSX.utils.json_to_sheet(faltanEnDocumentos.map(mapRowE), { header: headers });
  const ws2 = XLSX.utils.json_to_sheet(faltanEnEgresos, { header: headers });

  const wb: XLSX.WorkBook = {
    SheetNames: ['Solo_en_Egresos', 'Solo_en_Bancos'],
    Sheets: {
      Solo_en_Egresos: ws1,
      Solo_en_Bancos: ws2,
    },
  };

  const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const nombre = `conciliacion_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(new Blob([blob]), nombre);
}