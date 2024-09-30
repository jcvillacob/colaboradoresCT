import { Component } from '@angular/core';
import { ConductoresService } from '../../services/conductores.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-archivos-subidos',
  templateUrl: './archivos-subidos.component.html',
  styleUrls: ['./archivos-subidos.component.scss']
})
export class ArchivosSubidosComponent {
  filtro!: string;
  capacitacionesFiltro: any[] = [];
  capacitaciones: any[] = [];
  spinner: boolean = true;

  // Variables para control de paginación
  pageNumber: number = 1;
  pageSize: number = 10;
  totalcapacitaciones: number = 0;

  constructor(private conductoresService: ConductoresService) {
    this.getCapacitaciones();
  }

  getCapacitaciones() {
    this.spinner = true;
    this.conductoresService.getAllCapacitaciones().subscribe(data => {
      this.capacitaciones = data;
      this.capacitacionesFiltro = data;
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  deleteCapacitacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto elminará la capacitación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.conductoresService.deleteCapacitacion(id).subscribe(data => {
          this.getCapacitaciones();
        })
        Swal.fire(
          'Capacitación Eliminada',
          'La capacitación ha sido eliminada exitosamente.',
          'success'
        )
      }
    });
  }

  filtroTabla() {
    if (this.filtro) {
      this.capacitacionesFiltro = this.capacitaciones.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const tituloContieneFiltro = elemento.Titulo.toLowerCase().includes(filtroMinuscula);
        const grupoContieneFiltro = elemento.Grupos.toLowerCase().includes(filtroMinuscula);
        return tituloContieneFiltro || grupoContieneFiltro;
      });
    } else {
      this.capacitacionesFiltro = this.capacitaciones;
    }
  }

  // Método para ir a la página siguiente
  goToNextPage() {
    this.pageNumber++;
    this.loadcapacitaciones();
  }

  // Método para ir a la página anterior
  goToPreviousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadcapacitaciones();
    }
  }

  get totalPages() {
    return Math.ceil(this.totalcapacitaciones / this.pageSize);
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
    this.loadcapacitaciones();
  }

  // Método para cargar las capacitaciones según la página y el tamaño de página
  loadcapacitaciones() {
    /* this.capacitacionesService.getcapacitaciones(this.pageNumber, this.pageSize).subscribe((data: any) => {
      this.capacitaciones = data.data;
      this.totalcapacitaciones = data.total;
      this.capacitacionesFiltro = this.capacitaciones;
    }); */
  }

}
