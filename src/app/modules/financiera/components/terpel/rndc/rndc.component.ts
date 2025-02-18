import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TerpelService } from '../../../services/terpel.service';

@Component({
  selector: 'app-rndc',
  templateUrl: './rndc.component.html',
  styleUrl: './rndc.component.scss',
})
export class RndcComponent {
  facturasCount: number | null = null;
  excelData: any[] = [];

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

      // Verificamos que la columna "NumeroFactura" exista
      if (data.length === 0 || !data[0].hasOwnProperty('NumeroFactura')) {
        Swal.fire(
          'Error',
          'La columna "NumeroFactura" no existe en el archivo.',
          'error'
        );
        this.facturasCount = null;
        return;
      }

      // Filtramos y contamos las filas que tengan valor en "NumeroFactura"
      this.excelData = data.filter((row) => row['NumeroFactura'] !== '');
      this.facturasCount = this.excelData.length;
      Swal.fire(
        'Información',
        `Se encontraron ${this.facturasCount} entradas con la columna NumeroFactura.`,
        'info'
      );
    };
    reader.readAsBinaryString(target.files[0]);
  }

  actualizarRNDC() {
    // Extraer solo la propiedad NumeroFactura de cada fila y crear una lista de strings
    const facturasList: string[] = this.excelData.map(
      (row: any) => row.NumeroFactura
    );
    this.terpelService.actualizarRNDC({ facturas: facturasList }).subscribe(
      (response) => {
        Swal.fire('Éxito', `Actualizamos el reporte al RNDC de ${response.affectedRows} Facturas`, 'success').then(
          () => {
            // Reiniciamos la data y limpiamos el input
            this.excelData = [];
            this.facturasCount = null;
            if (this.fileInput) {
              this.fileInput.nativeElement.value = '';
            }
          }
        );
      },
      (error) => {
        Swal.fire('Error', 'Error al actualizar RNDC', 'error');
      }
    );
  }
}
