import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TerpelService } from '../../../services/terpel.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-facturacion-manual',
  templateUrl: './facturacion-manual.component.html',
  styleUrls: ['./facturacion-manual.component.scss'],
})
export class FacturacionManualComponent {
  recordsCount: number | null = null;
  excelData: any[] = [];
  isLoading: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private terpelService: TerpelService) {}

  onFileChange(evt: any) {
    const target: DataTransfer = evt.target;
    if (target.files.length !== 1) {
      Swal.fire('Error', 'No se pueden procesar múltiples archivos', 'error');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any[];

      // Verificamos que exista al menos la columna "NumeroTransporte" (puedes ajustar la validación)
      if (data.length === 0 || !data[0].hasOwnProperty('NumeroTransporte')) {
        Swal.fire(
          'Error',
          'El archivo no contiene la columna "NumeroTransporte".',
          'error'
        );
        this.recordsCount = null;
        return;
      }

      // Filtramos los registros que tengan datos en "NumeroTransporte"
      this.excelData = data.filter((row) => row['NumeroTransporte'] !== '');
      this.recordsCount = this.excelData.length;
      Swal.fire(
        'Información',
        `Se encontraron ${this.recordsCount} registros.`,
        'info'
      );
    };
    reader.readAsBinaryString(target.files[0]);
  }

  reportarBD() {
    if (this.excelData.length === 0) {
      Swal.fire('Error', 'No hay datos para reportar.', 'error');
      return;
    }

    this.isLoading = true;

    // Se crean las peticiones para cada registro, mapeando las columnas del Excel a los parámetros del endpoint
    const requests = this.excelData.map((record) => {
      const data = {
        NumeroTransporte: record.NumeroTransporte,
        NumeroRemision: record.NumeroRemision,
        NumeroGasto: record.NumeroGasto,
        FechaServicio: record.FechaServicio,
        PlantaCargue: record.PlantaCargue,
        DocCompra: record.DocCompra,
        HojaEntradaServ: record.HojaEntradaServ,
        ValorNeto: record.ValorNeto,
        ResponsablePlantaCargue: record.ResponsablePlantaCargue,
        PlacaVehiculo: record.PlacaVehiculo,
        Ruta: record.Ruta,
      };
      return this.terpelService.crearFacturacion(data);
    });

    // Ejecutamos todas las peticiones de forma concurrente
    forkJoin(requests).subscribe(
      (responses) => {
        // Contar facturas nuevas y existentes
        const nuevas = responses.filter(
          (r: any) =>
            r.facturacionID !== -1 && !r.error && r.facturacionID !== null
        ).length;
        const existentes = responses.filter(
          (r: any) => r.facturacionID === -1 && !r.error
        ).length;
        const fallidas = responses.filter(
          (r: any) => r.error || r.facturacionID === null
        ).length;

        this.isLoading = false;
        Swal.fire(
          'Éxito',
          `Se almacenaron ${nuevas} facturas nuevas, ${existentes} ya existían y ${fallidas} fallaron.`,
          'success'
        ).then(() => {
          this.excelData = [];
          this.recordsCount = null;
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        });
      },
      (error) => {
        // En este caso, el bloque de error no se debería ejecutar ya que cada observable
        // maneja su propio error, pero se deja por si acaso.
        this.isLoading = false;
        Swal.fire('Error', 'Error al reportar en la base de datos', 'error');
      }
    );
  }
}
