import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

export interface MovimientoDTO {
  Banco: string;
  Fecha: string;
  DescMot: string;
  ValorTotal: number;
}

@Injectable({ providedIn: 'root' })
export class ConciliacionServiceService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  /* EGRESOS */
  getEgresos( days: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/egresos/egresosdias?days=${days}`);
  }

  /* ─────────────────────────── NIVEL 1 ──────────────────────────── */

  /**
   * Recibe un array de archivos (.xls, .xlsx, .csv) y
   * devuelve una única tabla con todas las filas ya normalizadas.
   */
  async obtenerMovimientos(files: File[]): Promise<MovimientoDTO[]> {
    const resultado: MovimientoDTO[] = [];

    for (const file of files) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();

      if (ext === 'xls' || ext === 'xlsx') {
        resultado.push(...(await this.obtenerTablaExcel(file)));
      } else if (ext === 'csv') {
        resultado.push(...(await this.obtenerTablaCsv(file)));
      } else {
        console.warn(`⚠️ Extensión no soportada: ${file.name}`);
      }
    }

    return resultado;
  }

  /* ─────────────────────────── NIVEL 2 ──────────────────────────── */

  /** Lee un .xls/.xlsx de Davivienda y aplica los filtros solicitados */
  private async obtenerTablaExcel(file: File): Promise<MovimientoDTO[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.SheetNames.map((n) => ({
      filas: XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[n], {
        header: 1,
        defval: '',
        blankrows: false,
      }),
    })).find(
      (h) => h.filas.length && h.filas.some((r) => r.some((c) => c !== ''))
    );
    if (!sheet) throw new Error('El Excel no contiene datos útiles.');

    const cuerpo = sheet.filas.slice(2, Math.max(2, sheet.filas.length - 3));

    return cuerpo.map((row) => ({
      Banco: 'Davivienda',
      Fecha: this.formatearFecha(row[0]),
      DescMot: (row[7] ?? '').toString().trim(),
      ValorTotal: this.parsearNumeroExcel(row[8]), // ⬅️
    }));
  }

  /** Lee un .csv de Bancolombia con separador “,” y estructura fija */
  private async obtenerTablaCsv(file: File): Promise<MovimientoDTO[]> {
    const texto = await file.text();
    return texto
      .split(/\r?\n/)
      .filter((l) => l.trim())
      .map((l) => l.split(','))
      .filter((c) => c.length >= 8)
      .map((c) => ({
        Banco: 'Bancolombia',
        Fecha: this.ddmmyyyyToIso(c[3]),
        DescMot: c[7].trim(),
        ValorTotal: this.parsearNumeroCsv(c[5]), // ⬅️
      }));
  }

  /* ─────────────────────────── NIVEL 3 ──────────────────────────── */

  /** Excel Davivienda: "$ 1.234,56" → 1234.56 */
  private parsearNumeroExcel(value: any): number {
    if (typeof value === 'number') return value;
    const limpio = value
      .toString()
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(limpio) || 0;
  }

  /** CSV Bancolombia: "-1852.73" sólo limpiar espacios */
  private parsearNumeroCsv(value: any): number {
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().trim()) || 0;
  }

  /** “28/05/2025” (o 28052025) » "2025-05-28" */
  private ddmmyyyyToIso(value: string): string {
    const limpio = value.replace(/[^\d]/g, '');
    if (limpio.length === 8) {
      const dd = limpio.slice(0, 2);
      const mm = limpio.slice(2, 4);
      const yy = limpio.slice(4);
      return `${yy}-${mm}-${dd}`;
    }
    return value;
  }

  /** Devuelve “YYYY-MM-DD” si recibe Date; si no, texto limpio */
  private formatearFecha(value: any): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return value.toString().trim();
  }

  /** "$ 1.234,56" ─► 1234.56 */
  private parsearNumero(value: any): number {
    if (typeof value === 'number') return value;
    const limpio = value
      .toString()
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(limpio) || 0;
  }
}
