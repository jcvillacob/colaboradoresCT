import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MovimientoDTO, Egreso } from '../models/movimiento.dto';
import { CUENTAS } from '../utils/cuentas';
import { EXCLUDE_PATTERNS, filtrarExcluidos } from '../utils/exclusion';
import { exportarConciliacionAExcel } from '../utils/exportador';
import {
  formatearFecha,
  normalizarFecha8,
  parsearNumeroCsv,
  parsearNumeroExcel
} from '../utils/parse';

import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getEgresos(days: number): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.apiUrl}/egresos/egresosdias?days=${days}`);
  }

  async obtenerMovimientos(files: File[]): Promise<MovimientoDTO[]> {
    const out: MovimientoDTO[] = [];

    const extToBanco: Record<string, 'Davivienda' | 'Bancolombia' | undefined> = {
      xls: 'Davivienda',
      xlsx: 'Davivienda',
      csv: 'Bancolombia',
    };

    for (const file of files) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const nombre = file.name.toLowerCase();

      const empresa: keyof typeof CUENTAS = /codiesel/.test(nombre) ? 'codiesel' : 'coorditanques';
      const banco = extToBanco[ext];
      if (!banco) continue;

      const cuenta = CUENTAS[empresa][banco.toLowerCase() as 'davivienda' | 'bancolombia'];

      const movimientos = banco === 'Davivienda'
        ? await this.obtenerTablaExcel(file, banco, cuenta)
        : await this.obtenerTablaCsv(file, banco, cuenta);

      out.push(...filtrarExcluidos(movimientos));
    }

    return out;
  }

  cruzarEgresosConDocumentos(
    egresos: Egreso[],
    documentos: MovimientoDTO[],
    tolerancia = 0,
    invertirSignoEgresos = true
  ): { faltanEnDocumentos: Egreso[]; faltanEnEgresos: MovimientoDTO[] } {
    const key = (c: string, f: string, v: number) => `${c}|${f}|${v.toFixed(2)}`;

    const normalizar = (cuenta: string, fecha: string, valor: number) => ({
      cuenta: (cuenta ?? '').toString().trim(),
      fecha: (fecha ?? '').toString().slice(0, 10),
      valor: Number(valor),
    });

    // Conjunto de documentos (banco) tal cual vienen
    const docs = new Set(
      documentos.map(d => {
        const { cuenta, fecha, valor } = normalizar(d.Cuenta, d.Fecha, d.ValorTotal);
        return key(cuenta, fecha, valor);
      })
    );

    // Conjunto de egresos, ajustando signo si es necesario para igualar criterio del banco
    const egrs = new Set(
      egresos.map(e => {
        const rawValor = Number(e.VALOR);
        const adjValor = invertirSignoEgresos ? -rawValor : rawValor;
        const { cuenta, fecha, valor } = normalizar(e.NROCTA || e.CUENTA || '', e.FECHA, adjValor);
        return key(cuenta, fecha, valor);
      })
    );

    const cmpTol = (set: Set<string>, c: string, f: string, v: number) =>
      tolerancia
        ? [...set].some(k => {
            const [C, F, V] = k.split('|');
            return C === c && F === f && Math.abs(parseFloat(V) - v) <= tolerancia;
          })
        : set.has(key(c, f, v));

    return {
      // Egresos que no aparecen en documentos (banco)
      faltanEnDocumentos: egresos.filter(e => {
        const rawValor = Number(e.VALOR);
        const adjValor = invertirSignoEgresos ? -rawValor : rawValor;
        const { cuenta, fecha, valor } = normalizar(e.NROCTA || e.CUENTA || '', e.FECHA, adjValor);
        return !cmpTol(docs, cuenta, fecha, valor);
      }),
      // Documentos (banco) que no aparecen en egresos
      faltanEnEgresos: documentos.filter(d => {
        const { cuenta, fecha, valor } = normalizar(d.Cuenta, d.Fecha, d.ValorTotal);
        return !cmpTol(egrs, cuenta, fecha, valor);
      }),
    };
  }

  exportarResultado(faltanEnDocumentos: Egreso[], faltanEnEgresos: MovimientoDTO[]): void {
    exportarConciliacionAExcel(faltanEnDocumentos, faltanEnEgresos);
  }

  private async obtenerTablaExcel(file: File, banco: 'Davivienda', cuenta: string): Promise<MovimientoDTO[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

    const hoja = workbook.SheetNames.map(n => ({
      filas: XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[n], {
        header: 1,
        defval: '',
        blankrows: false,
      }),
    })).find(h => h.filas.length && h.filas.some(r => r.some(c => c !== '')));

    if (!hoja) throw new Error('El Excel no contiene datos útiles.');

    const cuerpo = hoja.filas.slice(2, Math.max(2, hoja.filas.length - 2));

    return cuerpo.map((row) => ({
      Banco: banco,
      Cuenta: cuenta,
      Fecha: formatearFecha(row[0]),
      DescMot: (row[7] ?? '').toString().trim(),
      ValorTotal: parsearNumeroExcel(row[8]),
    }));
  }

  private async obtenerTablaCsv(file: File, banco: 'Bancolombia', cuenta: string): Promise<MovimientoDTO[]> {
    const texto = await file.text();
    return texto
      .split(/\r?\n/)
      .filter(l => l.trim())
      .map(l => l.split(','))
      .filter(c => c.length >= 8)
      .map(c => ({
        Banco: banco,
        Cuenta: cuenta,
        Fecha: normalizarFecha8(c[3]),
        DescMot: c[7].trim(),
        ValorTotal: parsearNumeroCsv(c[5]),
      }));
  }
}