import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProyectosService } from '../../../services/proyectos.service';

interface Tarea {
  TareaID: number;
  Titulo: string;
  Descripcion: string;
  FechaLimite: string;
  Estado: string;
  Usuarios: Usuario[];
  ProyectoID: number;
  NombreProyecto: string;
}

interface Usuario {
  UsuarioID: number;
  Nombre: string;
  Tareas: Tarea[]; // Todas las tareas
  porHacer: Tarea[]; // Tareas en planeación
  enProgreso: Tarea[]; // Tareas en progreso
  completado: Tarea[]; // Tareas completadas
}

@Component({
  selector: 'app-tareas-usuario',
  templateUrl: './tareas-usuario.component.html',
  styleUrls: ['./tareas-usuario.component.scss']
})
export class TareasUsuarioComponent implements OnInit {
  proyectos: any[] = [];
  usuarios: Usuario[] = [];
  spinner: boolean = true;

  constructor(private proyectosService: ProyectosService) { }

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectosService.getProyectos().subscribe(data => {
      this.proyectos = data;
      let tareasCargadas = 0;
      const totalProyectos = this.proyectos.length;

      if (totalProyectos === 0) {
        // No hay proyectos, por lo que no se intentará cargar tareas
        return;
      }

      this.proyectos.forEach(project => {
        this.proyectosService.getTareasPorProyecto(project.ProyectoID).subscribe(tareas => {
          project.Tareas = tareas;
          tareasCargadas++;
          if (tareasCargadas === totalProyectos) {
            this.transformarDatos(this.proyectos);
          }
        }, error => {
          console.error('Error al cargar las tareas del proyecto', project.ProyectoID, error);
          tareasCargadas++;
          if (tareasCargadas === totalProyectos) {
            this.transformarDatos(this.proyectos);
          }
        });
      });
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  transformarDatos(proyectos: any[]) {
    const usuariosMap = new Map<number, Usuario>();

    proyectos.forEach(proyecto => {
      if (!proyecto.Tareas) {
        return;
      }

      proyecto.Tareas.forEach((tarea: any) => {
        tarea.Usuarios.forEach((usuario: Usuario) => {
          if (!usuariosMap.has(usuario.UsuarioID)) {
            usuariosMap.set(usuario.UsuarioID, {
              UsuarioID: usuario.UsuarioID,
              Nombre: usuario.Nombre,
              Tareas: [],
              porHacer: [],
              enProgreso: [],
              completado: []
            });
          }

          const usuarioActual = usuariosMap.get(usuario.UsuarioID)!;
          const tareaConProyecto = { ...tarea, ProyectoID: proyecto.ProyectoID, NombreProyecto: proyecto.Nombre };

          // Añadir la tarea a la lista general y a la lista específica según su estado
          usuarioActual.Tareas.push(tareaConProyecto);
          switch(tarea.Estado) {
            case 'planeacion':
              usuarioActual.porHacer.push(tareaConProyecto);
              break;
            case 'enProgreso':
              usuarioActual.enProgreso.push(tareaConProyecto);
              break;
            case 'completado':
              usuarioActual.completado.push(tareaConProyecto);
              break;
          }
        });
      });
    });

    this.usuarios = Array.from(usuariosMap.values());
  }

  onDrop(event: CdkDragDrop<Tarea[]>, nuevoEstado: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const tareaMovida = event.container.data[event.currentIndex];
    this.actualizarEstadoTarea(tareaMovida, nuevoEstado);
  }

  actualizarEstadoTarea(tarea: any, nuevoEstado: string) {
    this.proyectosService.setState(tarea.TareaID, {estado: nuevoEstado}).subscribe(data => {
      this.cargarProyectos();
    });
  }
}
