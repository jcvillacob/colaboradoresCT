import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as BlogsActions from '../../store/blogs.actions';
import * as fromBlogs from '../../store/blogs.reducer';
import { BoletinService } from '../../services/boletin.service';
import Swal from 'sweetalert2';

export interface Boletin {
  Mes: string; // Formato: 'YYYY-MM'
  Blog1ID: number;
  Blog2ID: number;
  Blog3ID: number;
  Blog4ID: number;
}

@Component({
  selector: 'app-boletin',
  templateUrl: './boletin.component.html',
  styleUrls: ['./boletin.component.scss'],
})
export class BoletinComponent implements OnInit {
  blogs: any[] = [];
  selectedBlogs: any[] = [];
  allSelected: boolean = false;
  boletinExistente: boolean = false; // Propiedad para el estado del boletín

  constructor(
    private store: Store<{ blogs: fromBlogs.BlogsState }>,
    private boletinService: BoletinService
  ) {}

  ngOnInit(): void {
    // Disparamos la acción para cargar los blogs
    this.store.dispatch(BlogsActions.loadBlogs());

    // Seleccionamos del estado el listado de blogs y filtramos los del mes actual
    this.store.select('blogs').subscribe((state: fromBlogs.BlogsState) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      this.blogs = state.blogs.filter((blog) => {
        const blogDate = new Date(blog.FechaCreacion);
        return (
          blogDate.getMonth() === currentMonth &&
          blogDate.getFullYear() === currentYear
        );
      });
    });

    // Verificamos si ya existe un boletín para el mes actual
    this.checkBoletinExistente();
  }

  // Método para consultar si existe un boletín para el mes actual
  checkBoletinExistente(): void {
    this.boletinService.getBoletines().subscribe({
      next: (data: any) => {
        // Si 'data' tiene contenido, asumimos que el boletín existe
        this.boletinExistente = !!data;
      },
      error: (err: any) => {
        console.error(err);
        // En caso de error, podemos asumir que no existe o manejarlo según convenga
        this.boletinExistente = false;
      },
    });
  }

  // Alterna la selección individual de un blog
  toggleSelection(blog: any): void {
    const index = this.selectedBlogs.findIndex((b) => b.BlogID === blog.BlogID);
    if (index > -1) {
      this.selectedBlogs.splice(index, 1);
    } else {
      if (this.selectedBlogs.length < 4) {
        this.selectedBlogs.push(blog);
      } else {
        // Opcional: Mostrar notificación si se intenta seleccionar más de 4 blogs
      }
    }
    this.actualizarAllSelected();
  }

  // Alterna la selección de todos (máximo los primeros 4 blogs)
  toggleAllSelection(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.selectedBlogs =
        this.blogs.length > 4 ? this.blogs.slice(0, 4) : [...this.blogs];
    } else {
      this.selectedBlogs = [];
    }
    this.allSelected = checked;
  }

  // Retorna true si el blog está seleccionado
  isSelected(blog: any): boolean {
    return this.selectedBlogs.some((b) => b.BlogID === blog.BlogID);
  }

  // Actualiza el estado del checkbox “seleccionar todos”
  actualizarAllSelected(): void {
    this.allSelected =
      this.blogs.length > 0 && this.selectedBlogs.length === this.blogs.length;
  }

  // Lógica para crear el boletín con los 4 blogs seleccionados
  crearBoletin(): void {
    if (this.selectedBlogs.length !== 4) {
      return;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const mesFormateado = `${year}-${month}`;

    const boletinData: Boletin = {
      Mes: mesFormateado,
      Blog1ID: this.selectedBlogs[0].BlogID,
      Blog2ID: this.selectedBlogs[1].BlogID,
      Blog3ID: this.selectedBlogs[2].BlogID,
      Blog4ID: this.selectedBlogs[3].BlogID,
    };

    this.boletinService.createBoletin(boletinData).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El boletín se creó correctamente.',
        });
        // Después de crear el boletín, actualizamos el estado
        this.checkBoletinExistente();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el boletín.',
        });
      },
    });
  }
}
