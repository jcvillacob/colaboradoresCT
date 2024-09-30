import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { ClienteExternoService } from '../../services/cliente-externo.service';

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.scss']
})
export class PqrsComponent {
  archivoSeleccionado: File | null = null;
  uploadedFiles: File[] = [];
  pqrs: any[] = [];
  pqrsSelected: any[] = [];
  filtro!: string;
  filters = {
    tipo: new Set<string>(),
    estado: new Set<string>()
  };
  pqrsData = {
    empresa: '',
    nit: '',
    nombre: '',
    email: '',
    cargo: '',
    telefono: null,
    tipoPqrs: '',
    descripcion: ''
  };

  constructor(private clienteExternoService: ClienteExternoService) {
    this.getPqrs();
  }

  /* PQRS */
  getPqrs() {
    this.clienteExternoService.getPqrs().subscribe(data => {
      this.pqrs = data.reverse();
      this.pqrsSelected = this.pqrs;
      this.filtro = '';
      setTimeout(() => {
        initFlowbite();
      }, 200);
    })
  }

  createPqrs() {
    // * Comprobación de que todos los campos necesarios están llenos
    if (!this.pqrsData.empresa || !this.pqrsData.nit || !this.pqrsData.nombre || !this.pqrsData.email ||
      !this.pqrsData.cargo || !this.pqrsData.telefono || !this.pqrsData.tipoPqrs || !this.pqrsData.descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos deben estar llenos.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('empresa', this.pqrsData.empresa);
    formData.append('nit', this.pqrsData.nit);
    formData.append('nombre', this.pqrsData.nombre);
    formData.append('email', this.pqrsData.email);
    formData.append('cargo', this.pqrsData.cargo);
    formData.append('telefono', this.pqrsData.telefono);
    formData.append('tipoPqrs', this.pqrsData.tipoPqrs);
    formData.append('descripcion', this.pqrsData.descripcion);

    for (const file of this.uploadedFiles) {
      formData.append('files', file, file.name);
    }

    this.clienteExternoService.crearPqrs(formData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Éxito',
          text: `La PQRS ha sido creada con el radicado número ${response.id}.`,
          icon: 'success'
        });
        this.pqrsData = {
          empresa: '',
          nit: '',
          nombre: '',
          email: '',
          cargo: '',
          telefono: null,
          tipoPqrs: '',
          descripcion: ''
        };
        this.uploadedFiles = [];
        this.getPqrs();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la PQRS. Por favor, intenta de nuevo.',
        });
      }
    });
  }

  eliminarPqrs(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará la solicitud',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteExternoService.deletePqrs(id).subscribe(data => {
          this.getPqrs();
          Swal.fire(
            'PQRS Eliminada',
            'La PQRS ha sido eliminada exitosamente.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            'PQRS NO Eliminada',
            'La PQRS no ha podido ser eliminada.',
            'warning'
          )
        });
      };
    });
  }

  getStateClass(estado: string): string {
    switch (estado) {
      case 'Recibido':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white';
      case 'Cerrado':
        return 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  onFileSelected(event: any): void {
    const archivo = event.target.files[0];
    if (archivo && archivo.size > 15728640) {
      Swal.fire(
        'Archivo demasiado grande',
        'El archivo no debe exceder los 15 MB',
        'error'
      );
      event.target.value = '';
    } else {
      if (archivo) {
        this.uploadedFiles.push(archivo);
        (document.getElementById('fileUpload') as HTMLInputElement).value = '';
      }
    }
  }

  getFileIcon(file: File): string {
    const fileType = file.type;
    if (fileType.includes('pdf')) {
      return 'assets/Iconos files/pdf.svg';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return 'assets/Iconos files/excel.svg';
    } else if (fileType.includes('word')) {
      return 'assets/Iconos files/word.svg';
    } else if (fileType.includes('image')) {
      return 'assets/Iconos files/imagen.svg';
    } else if (fileType.includes('video')) {
      return 'assets/Iconos files/vlc.svg';
    } else {
      return 'assets/Iconos files/imagen.svg';
    }
  }

  /* Filtros */
  filtroPqrs() {
    if (this.filtro) {
      this.pqrsSelected = this.pqrs.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const radicadoContieneFiltro = elemento.PqrsID.toString().toLowerCase().includes(filtroMinuscula);
        const empresaContieneFiltro = elemento.Empresa.toLowerCase().includes(filtroMinuscula);
        const NITContieneFiltro = elemento.NIT.toLowerCase().includes(filtroMinuscula);
        return empresaContieneFiltro || NITContieneFiltro || radicadoContieneFiltro;
      });
    } else {
      this.pqrsSelected = this.pqrs;
      initFlowbite();
    }
  }

  updateFilters(event: any, filterType: 'tipo' | 'estado') {
    const value = event.target.value;
    if (event.target.checked) {
      this.filters[filterType].add(value);
    } else {
      this.filters[filterType].delete(value);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.pqrsSelected = this.pqrs.filter(pqrs => {
      const tipoMatch = this.filters.tipo.size ? this.filters.tipo.has(pqrs.TipoPqrs) : true;
      const estadoMatch = this.filters.estado.size ? this.filters.estado.has(pqrs.Estado) : true;
      return tipoMatch && estadoMatch;
    });
  }





}
