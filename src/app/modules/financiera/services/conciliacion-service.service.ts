/* conciliation-service.service.ts
 * Versión FINAL ─ 4 archivos, cruce por Cuenta-Fecha-Valor,
 * exportación con NOTA y filtro de conceptos importado por JSON
 * ------------------------------------------------------------------ */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/* 📥  Importa el JSON (TypeScript ≥ 4.5 con resolveJsonModule) */
import EXCLUDE_PATTERNS_JSON from './conceptos-excluir.json';

/* Normaliza a MAYÚSCULAS y sin espacios laterales */
const EXCLUDE_PATTERNS = (EXCLUDE_PATTERNS_JSON as string[]).map((s) =>
  s.toUpperCase().trim()
);

/* DTO visible para la UI */
export interface MovimientoDTO {
  Banco: string;       // "Davivienda" | "Bancolombia"
  Cuenta: string;      // Nº de cuenta corriente
  Fecha: string;       // ISO "YYYY-MM-DD"
  DescMot: string;     // Concepto / Descripción
  ValorTotal: number;  // Importe (+ abono | – débito)
}

/* Tabla Empresa → Nº de cuenta por banco */
const CUENTAS: Record<
  'coorditanques' | 'codiesel',
  { davivienda: string; bancolombia: string }
> = {
  coorditanques: {
    davivienda: '39269998934',
    bancolombia: '00313934411',
  },
  codiesel: {
    davivienda: '39269998645',
    bancolombia: '00700001424',
  },
};

@Injectable({ providedIn: 'root' })
export class ConciliacionServiceService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  /* ──────────────── ENDPOINT REST ─────────────── */
  getEgresos(days: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/egresos/egresosdias?days=${days}`
    );
  }

  /* ─────────── PARSE DE ARCHIVOS SUBIDOS ───────── */
  async obtenerMovimientos(files: File[]): Promise<MovimientoDTO[]> {
    const out: MovimientoDTO[] = [];

    for (const file of files) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const nombre = file.name.toLowerCase();

      /* Empresa según nombre de archivo (default → coorditanques) */
      const empresa: 'coorditanques' | 'codiesel' =
        /codiesel/.test(nombre) ? 'codiesel' : 'coorditanques';

      /* Banco según extensión */
      let banco: 'Davivienda' | 'Bancolombia';
      if (ext === 'xls' || ext === 'xlsx') banco = 'Davivienda';
      else if (ext === 'csv') banco = 'Bancolombia';
      else {
        console.warn(`⚠️ Extensión no soportada: ${file.name}`);
        continue;
      }

      /* Nº de cuenta */
      const cuenta =
        banco === 'Davivienda'
          ? CUENTAS[empresa].davivienda
          : CUENTAS[empresa].bancolombia;

      /* Parsers */
      const movimientos =
        banco === 'Davivienda'
          ? await this.obtenerTablaExcel(file, banco, cuenta)
          : await this.obtenerTablaCsv(file, banco, cuenta);

      /* Filtra por patrón de exclusión (prefijo, mayúsculas) */
      out.push(
        ...movimientos.filter(
          (m) =>
            !EXCLUDE_PATTERNS.some((p) =>
              m.DescMot.toUpperCase().trim().startsWith(p)
            )
        )
      );
    }

    return out;
  }

  /* ──────── CRUCE EGRESOS ↔ DOCUMENTOS ───────── */
  cruzarEgresosConDocumentos(
    egresos: any[],
    documentos: MovimientoDTO[],
    tolerancia = 0
  ): { faltanEnDocumentos: any[]; faltanEnEgresos: MovimientoDTO[] } {
    const nE = (e: any) => ({
      cuenta: (e.NROCTA ?? e.CUENTA ?? '').toString().trim(),
      fecha: (e.FECHA ?? '').toString().slice(0, 10),
      valor: Number(e.VALOR),
    });
    const nD = (d: MovimientoDTO) => ({
      cuenta: (d.Cuenta ?? '').toString().trim(),
      fecha: (d.Fecha ?? '').slice(0, 10),
      valor: Number(d.ValorTotal),
    });
    const key = (c: string, f: string, v: number) => `${c}|${f}|${v.toFixed(2)}`;

    const docs = new Set(
      documentos.map(nD).map(({ cuenta, fecha, valor }) => key(cuenta, fecha, valor))
    );
    const egrs = new Set(
      egresos.map(nE).map(({ cuenta, fecha, valor }) => key(cuenta, fecha, valor))
    );

    const cmpTol = (set: Set<string>, c: string, f: string, v: number) =>
      tolerancia
        ? [...set].some((k) => {
            const [C, F, V] = k.split('|');
            return C === c && F === f && Math.abs(parseFloat(V) - v) <= tolerancia;
          })
        : set.has(key(c, f, v));

    return {
      faltanEnDocumentos: egresos.filter((e) => {
        const { cuenta, fecha, valor } = nE(e);
        return !cmpTol(docs, cuenta, fecha, valor);
      }),
      faltanEnEgresos: documentos.filter((d) => {
        const { cuenta, fecha, valor } = nD(d);
        return !cmpTol(egrs, cuenta, fecha, valor);
      }),
    };
  }

  /* ──────────── EXPORTADOR A EXCEL ──────────── */
  exportarResultado(
    faltanEnDocumentos: any[],
    faltanEnEgresos: MovimientoDTO[]
  ): void {
    /* Map para egresos (usa NOTA) */
    const mapRowE = (r: any): MovimientoDTO => ({
      Banco: (r.BANCO ?? '').toString().trim(),
      Cuenta: (r.NROCTA ?? '').toString().trim(),
      Fecha: (r.FECHA ?? '').toString().slice(0, 10),
      DescMot: (r.NOTA ?? '').toString().trim(),
      ValorTotal: Number(r.VALOR ?? 0),
    });

    /* Map para documentos cargados */
    const mapRowD = (r: any): MovimientoDTO => ({
      Banco: (r.Banco ?? '').toString().trim(),
      Cuenta: (r.Cuenta ?? '').toString().trim(),
      Fecha: (r.Fecha ?? '').toString().slice(0, 10),
      DescMot: (r.DescMot ?? '').toString().trim(),
      ValorTotal: Number(r.ValorTotal ?? 0),
    });

    const headers: (keyof MovimientoDTO)[] = [
      'Banco',
      'Cuenta',
      'Fecha',
      'DescMot',
      'ValorTotal',
    ];

    const ws1 = XLSX.utils.json_to_sheet(
      faltanEnDocumentos.map(mapRowE),
      { header: headers }
    );
    const ws2 = XLSX.utils.json_to_sheet(
      faltanEnEgresos.map(mapRowD),
      { header: headers }
    );

    const wb: XLSX.WorkBook = {
      SheetNames: ['Solo_en_Egresos', 'Solo_en_Documentos'],
      Sheets: {
        Solo_en_Egresos: ws1,
        Solo_en_Documentos: ws2,
      },
    };

    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const nombre = `conciliacion_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    saveAs(new Blob([blob]), nombre);
  }

  /* ──────── LECTORES XLS / CSV (con cuenta) ──────── */
  private async obtenerTablaExcel(
    file: File,
    banco: 'Davivienda',
    cuenta: string
  ): Promise<MovimientoDTO[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

    const hoja = workbook.SheetNames.map((n) => ({
      filas: XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[n], {
        header: 1,
        defval: '',
        blankrows: false,
      }),
    })).find((h) => h.filas.length && h.filas.some((r) => r.some((c) => c !== '')));

    if (!hoja) throw new Error('El Excel no contiene datos útiles.');

    const cuerpo = hoja.filas.slice(2, Math.max(2, hoja.filas.length - 3));

    return cuerpo.map((row) => ({
      Banco: banco,
      Cuenta: cuenta,
      Fecha: this.formatearFecha(row[0]),
      DescMot: (row[7] ?? '').toString().trim(),
      ValorTotal: this.parsearNumeroExcel(row[8]),
    }));
  }

  private async obtenerTablaCsv(
    file: File,
    banco: 'Bancolombia',
    cuenta: string
  ): Promise<MovimientoDTO[]> {
    const texto = await file.text();
    return texto
      .split(/\r?\n/)
      .filter((l) => l.trim())
      .map((l) => l.split(','))
      .filter((c) => c.length >= 8)
      .map((c) => ({
        Banco: banco,
        Cuenta: cuenta,
        Fecha: this.ddmmyyyyToIso(c[3]),
        DescMot: c[7].trim(),
        ValorTotal: this.parsearNumeroCsv(c[5]),
      }));
  }

  /* ─────────── UTILIDADES DE FECHA Y NÚMERO ─────────── */
  private excelSerialToIso(serial: number): string {
    let days = Math.floor(serial);
    if (days > 59) days -= 1; // Bug 1900-02-29
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + days * 86_400_000);
    return d.toISOString().slice(0, 10);
  }

  private formatearFecha(value: any): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    const num = Number(value);
    if (!isNaN(num) && /^\d+(\.\d+)?$/.test(value.toString())) {
      return this.excelSerialToIso(num);
    }
    return this.ddmmyyyyToIso(value.toString());
  }

  private parsearNumeroExcel(v: any): number {
    if (typeof v === 'number') return v;
    const limpio = v
      .toString()
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(limpio) || 0;
  }

  private parsearNumeroCsv(v: any): number {
    if (typeof v === 'number') return v;
    return parseFloat(v.toString().trim()) || 0;
  }

  private ddmmyyyyToIso(txt: string): string {
    const limpio = txt.replace(/[^\d]/g, '');
    if (limpio.length === 8) {
      const dd = limpio.slice(0, 2);
      const mm = limpio.slice(2, 4);
      const yy = limpio.slice(4);
      return `${yy}-${mm}-${dd}`;
    }
    return txt.trim();
  }
}
