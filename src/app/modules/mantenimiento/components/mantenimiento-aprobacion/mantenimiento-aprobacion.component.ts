import { Component } from '@angular/core';
import { NovedadesService } from '../../services/novedades.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-mantenimiento-aprobacion',
  templateUrl: './mantenimiento-aprobacion.component.html',
  styleUrls: ['./mantenimiento-aprobacion.component.scss']
})
export class MantenimientoAprobacionComponent {
  filtro: string = '';
  cruces: any[] = [];
  crucesFiltrados: any[] = [];
  crucesSinComprobantes: any[] = [];
  archivoSeleccionado: File | null = null;

  constructor(private novedadesService: NovedadesService) {
    this.getCruces();
  }

  ngOnInit(): void {
  }

  getCruces() {
    this.novedadesService.getCruces(0, 10).subscribe(data => {
      this.cruces = data.reverse();
      this.crucesFiltrados = this.cruces;
      this.crucesSinComprobantes = this.cruces.filter(elemento => !elemento.Comprobante);
    });
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

  /* Aprobaciones */
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
}
