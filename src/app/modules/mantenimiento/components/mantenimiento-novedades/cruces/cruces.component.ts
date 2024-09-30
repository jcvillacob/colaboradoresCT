import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { NovedadesService } from '../../../services/novedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cruces',
  templateUrl: './cruces.component.html',
  styleUrls: ['./cruces.component.scss']
})
export class CrucesComponent {
  cruces: any[] = [];
  crucesFiltrados: any[] = [];
  crucesSinComprobantes: any[] = [];
  archivoSeleccionado: File | null = null;
  excelData: any[] = [];
  envio: boolean = false;
  filtro: string = '';
  columnNames: string[] = ['tiquete', 'nombre', 'cedula', 'placa', 'fecha', 'ruta', 'km', 'glsEds', 'glsInsite', 'diferencia', 'operacion', 'valor', 'mes', 'quincena', 'año'];

  // Variables para control de paginación
  pageNumber: number = 1;
  pageSize: number = 30;
  totalNovedades: number = 0;

  constructor(private novedadesService: NovedadesService) {
    this.getCruces();
  }

  ngOnInit(): void {
  }

  /* Cruces */
  getCruces() {
    this.novedadesService.getCruces(this.pageNumber, this.pageSize).subscribe((data: any) => {
      this.cruces = data.data;
      this.crucesFiltrados = data.data;
      this.totalNovedades = data.total;
      this.crucesSinComprobantes = this.cruces.filter(elemento => !elemento.Comprobante);
    });
  }

  aprobarCruce(id: number, aprobar: number) {
    if (aprobar === 0) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto quitará la aprobación del cruce',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, quitar aprobación'
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, procede con la actualización
          const data = { aprobado: aprobar };
          this.novedadesService.updateAprobacion(id, data).subscribe(data => {
            this.getCruces();
          });
          // Muestra un mensaje de que la acción fue exitosa
          Swal.fire(
            'Aprobación Quitada',
            'La aprobación del cruce ha sido quitada exitosamente.',
            'success'
          )
        }
      });
    } else {
      const data = { aprobado: aprobar };
      this.novedadesService.updateAprobacion(id, data).subscribe(data => {
        this.getCruces();
      });
    }
  }

  /* Cargar y Mostrar Datos */
  onFileChange(evt: any): void {
    this.envio = false;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const rows = data.slice(1);
      this.excelData = rows.map((row: any) => {
        const arrayRow = row as any[];
        let obj: any = {};
        arrayRow.forEach((value, index) => {
          if (this.columnNames[index] === 'fecha' && typeof value === 'number') {
            obj[this.columnNames[index]] = this.convertExcelDateToJSDate(value);
          } else {
            obj[this.columnNames[index]] = value;
          }
        });
        return obj;
      });
      console.log(this.excelData);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  convertExcelDateToJSDate(serial: number): Date {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
  }

  onSubmit() {
    let c = 0;
    for (let dato of this.excelData) {
      this.novedadesService.setCruces(dato).subscribe(data => {
        c = c + 1;
        if (c = this.excelData.length) {
          this.excelData = [];
          this.envio = true;
          setTimeout(() => {
            this.envio = false;
          }, 5000);
          this.getCruces();
        }
      })
    }
  }

  filtroTabla() {
    if (this.filtro) {
      this.crucesFiltrados = this.cruces.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const cedulaContieneFiltro = elemento.Cedula.toLowerCase().includes(filtroMinuscula);
        const nombreContieneFiltro = elemento.Nombre.toLowerCase().includes(filtroMinuscula);
        const tiqueteContieneFiltro = elemento.Tiquete.toLowerCase().includes(filtroMinuscula);
        const placaContieneFiltro = elemento.Placa.toLowerCase().includes(filtroMinuscula);
        return cedulaContieneFiltro || nombreContieneFiltro || tiqueteContieneFiltro || placaContieneFiltro;
      });
    } else {
      this.crucesFiltrados = this.cruces;
    }
  }


  /* Comprobante */
  getComprobante(id: number) {
    this.novedadesService.getComprobante(id).subscribe((data: any) => {
      const byteArray = new Uint8Array(data.Documento.data);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', 'comprobante.pdf');
      document.body.appendChild(downloadLink);
      downloadLink.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(downloadLink);
    });
  }

  seleccionarArchivo(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  enviarDatos(): void {
    if (!this.archivoSeleccionado) {
      alert('Por favor, seleccione un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('documento', this.archivoSeleccionado);

    const idsSeleccionados = this.crucesSinComprobantes
      .filter(cruce => cruce.seleccionado)
      .map(cruce => cruce.Id);

    formData.append('ids', JSON.stringify(idsSeleccionados));

    this.novedadesService.setComprobantes(formData).subscribe(response => {
      this.getCruces();
    }, error => {
      console.error(error);
    });
  }


  /* Paginacion */
  // Método para ir a la página siguiente
  goToNextPage() {
    this.pageNumber++;
    this.getCruces();
  }

  // Método para ir a la página anterior
  goToPreviousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCruces();
    }
  }

  get totalPages() {
    return Math.ceil(this.totalNovedades / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.pageNumber - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.getCruces();
  }
}
