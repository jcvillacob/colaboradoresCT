import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TerpelService } from '../../../services/terpel.service';
import { forkJoin } from 'rxjs';

type FacturacionPayload = {
  NumeroTransporte: string;        // VARCHAR(20)
  NumeroRemision: string;          // VARCHAR(20)
  NumeroGasto: string;             // VARCHAR(20)
  FechaServicio: string;           // VARCHAR(8) -> YYYYMMDD
  PlantaCargue: string;            // VARCHAR(255)
  DocCompra: string;               // VARCHAR(20)
  HojaEntradaServ: string;         // VARCHAR(20)
  ValorNeto: number;               // DECIMAL(18,2)
  ResponsablePlantaCargue: string; // VARCHAR(255)
  PlacaVehiculo: string;           // VARCHAR(10)
  Ruta: string;                    // VARCHAR(255)
};

@Component({
  selector: 'app-facturacion-manual',
  templateUrl: './facturacion-manual.component.html',
  styleUrls: ['./facturacion-manual.component.scss'],
})
export class FacturacionManualComponent {
  recordsCount: number | null = null;
  excelData: any[] = [];
  isLoading = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private terpelService: TerpelService) {}

  // ---------------------------
  // Helpers de normalización
  // ---------------------------
  private toStr(v: any): string {
    return (v ?? '').toString().trim();
  }
  private toStrMax(v: any, max: number): string {
    return this.toStr(v).slice(0, max);
  }
  private pad2(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
  }
  /** Normaliza a YYYYMMDD (8 chars) desde Date, serial Excel, "dd/mm/yyyy", "yyyy-mm-dd", etc. */
  private normalizeFechaServicio(v: any): string {
    if (v === null || v === undefined || v === '') return '';

    // Caso: serial numérico de Excel
    if (typeof v === 'number') {
      const d = XLSX.SSF.parse_date_code(v);
      if (d && d.y && d.m && d.d) {
        return `${d.y}${this.pad2(d.m)}${this.pad2(d.d)}`.slice(0, 8);
      }
      const s = String(v);
      if (/^\d{8}$/.test(s)) return s;
    }

    // Caso: Date
    if (v instanceof Date && !isNaN(v.getTime())) {
      const y = v.getFullYear();
      const m = this.pad2(v.getMonth() + 1);
      const d = this.pad2(v.getDate());
      return `${y}${m}${d}`;
    }

    // Caso: string
    const s = this.toStr(v);

    // yyyy-mm-dd o dd/mm/yyyy u otras variantes comunes
    const ymd = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (ymd) {
      const [, y, m, d] = ymd;
      return `${y}${this.pad2(+m)}${this.pad2(+d)}`.slice(0, 8);
    }

    const dmy = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);
    if (dmy) {
      let [, d, m, y] = dmy as any;
      if (String(y).length === 2) y = `20${y}`; // heurística
      return `${String(y).padStart(4, '0')}${this.pad2(+m)}${this.pad2(+d)}`.slice(0, 8);
    }

    // Si ya son 8 dígitos (p.ej. 20250131)
    const digits = s.replace(/\D/g, '');
    if (digits.length === 8) return digits;

    return ''; // deja vacío si no pudo normalizar
  }

  /** Convierte a número (soporta "1.234,56" y "1,234.56"), retorna null si no parsea */
  private toNumberStrict(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number' && isFinite(v)) return v;

    // Quita separadores de miles y usa '.' como decimal
    const s = this.toStr(v)
      .replace(/\s/g, '')
      .replace(/\.(?=\d{3}(\D|$))/g, '') // puntos de miles
      .replace(/,(?=\d{3}(\D|$))/g, '')  // comas de miles (por si acaso)
      .replace(/,/, '.');                // coma decimal -> punto
    const n = Number(s);
    return isNaN(n) ? null : n;
  }

  // ---------------------------
  // Flujo
  // ---------------------------
  onFileChange(evt: any) {
    const target: DataTransfer = evt.target;
    if (target.files.length !== 1) {
      Swal.fire('Error', 'No se pueden procesar múltiples archivos', 'error');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;

      // Lee fechas como Date y permite usar el texto formateado si existe
      const wb: XLSX.WorkBook = XLSX.read(binaryStr, {
        type: 'binary',
        cellDates: true,
        cellNF: true,
      });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // raw:false -> usa el texto mostrado (preserva ceros a la izquierda si la celda está formateada)
      const data = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false }) as any[];

      if (data.length === 0 || !Object.prototype.hasOwnProperty.call(data[0], 'NumeroTransporte')) {
        Swal.fire('Error', 'El archivo no contiene la columna "NumeroTransporte".', 'error');
        this.recordsCount = null;
        return;
      }

      // Registros con NumeroTransporte no vacío
      this.excelData = data.filter((row) => this.toStr(row['NumeroTransporte']) !== '');
      this.recordsCount = this.excelData.length;
      Swal.fire('Información', `Se encontraron ${this.recordsCount} registros.`, 'info');
    };
    reader.readAsBinaryString((target as any).files[0]);
  }

  reportarBD() {
    if (this.excelData.length === 0) {
      Swal.fire('Error', 'No hay datos para reportar.', 'error');
      return;
    }

    this.isLoading = true;

    const requests = this.excelData.map((record) => {
      // Construye el payload tipado y formateado EXACTO a lo que tu back espera
      const payload: FacturacionPayload = {
        NumeroTransporte: this.toStrMax(record.NumeroTransporte, 20),
        NumeroRemision: this.toStrMax(record.NumeroRemision, 20),
        NumeroGasto: this.toStrMax(record.NumeroGasto, 20),
        FechaServicio: this.toStrMax(this.normalizeFechaServicio(record.FechaServicio), 8),
        PlantaCargue: this.toStrMax(record.PlantaCargue, 255),
        DocCompra: this.toStrMax(record.DocCompra, 20),
        HojaEntradaServ: this.toStrMax(record.HojaEntradaServ, 20),
        ValorNeto: (() => {
          const n = this.toNumberStrict(record.ValorNeto);
          return n === null ? 0 : Number(n.toFixed(2)); // DECIMAL(18,2)
        })(),
        ResponsablePlantaCargue: this.toStrMax(record.ResponsablePlantaCargue, 255),
        PlacaVehiculo: this.toStrMax(record.PlacaVehiculo, 10).toUpperCase(),
        Ruta: this.toStrMax(record.Ruta, 255),
      };

      // (Opcional) assert rápido en dev
      // console.table([{ field: 'NumeroTransporte', v: payload.NumeroTransporte, t: typeof payload.NumeroTransporte }, ...]);

      return this.terpelService.crearFacturacion(payload);
    });

    forkJoin(requests).subscribe(
      (responses: any[]) => {
        // Tu SQL devuelve:
        // - INSERT: SCOPE_IDENTITY() (número > 0)
        // - UPDATE: 0 AS FacturacionID
        // Ajustamos el conteo:
        const nuevas = responses.filter((r) => !r?.error && typeof r?.facturacionID === 'number' && r.facturacionID > 0).length;
        const existentes = responses.filter((r) => !r?.error && r?.facturacionID === 0).length;
        const fallidas = responses.filter((r) => r?.error || r?.facturacionID === null || r?.facturacionID === undefined).length;

        this.isLoading = false;
        Swal.fire(
          'Éxito',
          `Se almacenaron ${nuevas} facturas nuevas, ${existentes} se actualizaron y ${fallidas} fallaron.`,
          'success'
        ).then(() => {
          this.excelData = [];
          this.recordsCount = null;
          if (this.fileInput) this.fileInput.nativeElement.value = '';
        });
      },
      () => {
        this.isLoading = false;
        Swal.fire('Error', 'Error al reportar en la base de datos', 'error');
      }
    );
  }
}
