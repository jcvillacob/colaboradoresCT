import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ConductoresService } from '../../services/conductores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novedad',
  templateUrl: './novedad.component.html',
  styleUrls: ['./novedad.component.scss']
})
export class NovedadComponent implements OnInit {
  /* Para los select */
  years: number[] = [2023, 2024, 2025, 2026];
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  listaNovedades: any[] = [];
  novedades: any[] = [];
  novedadesFiltro: any[] = [];
  showToast: boolean = false;
  filtro!: string;

  // Variables para control de paginación
  pageNumber: number = 1;
  pageSize: number = 10;
  totalNovedades: number = 0;

  // Para el Formulario
  year: number = 2024;
  month: number = 1;
  cedula: string = '';
  novedad!: number;
  descripcion: string = '';

  constructor(private conductoresService: ConductoresService) {
    this.conductoresService.getListaNovedades().subscribe(data => {
      this.listaNovedades = data;
      this.loadNovedades();
    });
  }

  ngOnInit(): void {

  }

  filtroTabla() {
    if (this.filtro) {
      this.novedadesFiltro = this.novedades.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const cedulaContieneFiltro = elemento.Cedula.toLowerCase().includes(filtroMinuscula);
        const nombreContieneFiltro = elemento.nombre.toLowerCase().includes(filtroMinuscula);
        return cedulaContieneFiltro || nombreContieneFiltro;
      });
    } else {
      this.novedadesFiltro = this.novedades;
    }
  }

  // Método para ir a la página siguiente
  goToNextPage() {
    this.pageNumber++;
    this.loadNovedades();
  }

  // Método para ir a la página anterior
  goToPreviousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadNovedades();
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
    this.loadNovedades();
  }

  // Método para cargar las novedades según la página y el tamaño de página
  loadNovedades() {
    this.conductoresService.getNovedades(this.pageNumber, this.pageSize).subscribe((data: any) => {
      this.novedades = data.data;
      this.totalNovedades = data.total;
      this.novedadesFiltro = this.novedades;
      setTimeout(() => {
        initFlowbite();
      }, 200);
    });
  }

  eliminarNovedad(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto elminará la novedad',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.conductoresService.deleteNovedad(id).subscribe(data => {
          this.loadNovedades();
        })
        Swal.fire(
          'Novedad Eliminada',
          'La novedad ha sido eliminada exitosamente.',
          'success'
        )
      }
    });
  }


  onSubmit(): void {
    console.log('entra');
    const data = { "año": this.year, "mes": this.month, "cedula": this.cedula, "novedad": this.novedad, "descripcion": this.descripcion };
    this.conductoresService.setNovedades(data).subscribe(dato => {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.totalNovedades = 0;
      this.loadNovedades();
      this.filtro = '';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 5000);
    });
  }
}
