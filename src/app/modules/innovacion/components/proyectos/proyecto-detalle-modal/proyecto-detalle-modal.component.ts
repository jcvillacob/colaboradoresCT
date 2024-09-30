import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';


interface Usuario {
  UsuarioID: number;
  Nombre: string;
  seleccionado?: boolean;
}

@Component({
  selector: 'app-proyecto-detalle-modal',
  templateUrl: './proyecto-detalle-modal.component.html',
  styleUrls: ['./proyecto-detalle-modal.component.scss'],
})
export class ProyectoDetalleModalComponent implements OnInit, AfterViewInit {
  icons: { class: string, name: string }[] = [];
  nuevoProyecto: any = { nombre: '', descripcion: '', color: '', icono: '' };
  ProyectoID!: number;
  proyecto: any = {};
  tareas: any[] = [];
  descripcionTarea!: string;
  dateTarea!: Date;
  tituloTarea!: string;
  filtro = '';
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = this.usuarios;
  creador!: number;
  tareaAdd = false;
  spinner: boolean = true;

  constructor(
    private proyectosService: ProyectosService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.proyectosService.getUsuarios().subscribe((data) => {
      this.creador = this.authService.getUsuarioID();
      this.usuarios = data.filter((u) => u.UsuarioID != this.creador);
      this.usuariosFiltrados = this.usuarios;
      this.icons = this.proyectosService.icons;
    });
  }

  ngOnInit(): void {
    const proyectoId = this.route.snapshot.paramMap.get('id');
    if (proyectoId) {
      this.ProyectoID = +proyectoId;
      this.getProyecto();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      initFlowbite();
    }, 500)

  }

  /* Proyectos */
  getProyecto() {
    this.proyectosService.getProyecto(this.ProyectoID).subscribe((data) => {
      this.proyecto = data;
      this.nuevoProyecto = { nombre: this.proyecto.Nombre, descripcion: this.proyecto.Descripcion, color: this.proyecto.Color, icono: this.proyecto.Icono }
      this.getTareas();
      this.ActualizarUsuarios();
      setTimeout(() => {
        this.spinner = false;
      }, 700);
    });
  }

  getState(): string {
    const totalTareas = this.tareas.length;
    if(totalTareas === 0) {
      return 'En Planeación';
    };
    const tareasCompletadas = this.tareas.filter(tarea => tarea.Estado === 'completado').length;
    const tareasProgreso = this.tareas.filter(tarea => tarea.Estado === 'enProgreso').length;
    let estado;
    if(tareasCompletadas / totalTareas === 1) {
      estado = 'Completado';
    } else if ((tareasCompletadas + tareasProgreso) / totalTareas > 0) {
      estado = 'En Progreso';
    } else {
      estado = 'En Planeación';
    }
    return estado;
  }

  guardarIcono(clases: string) {
    this.nuevoProyecto.icono = clases;
  }

  updateProyecto() {
    this.proyectosService.actualizarProyecto(this.ProyectoID, this.nuevoProyecto).subscribe(data => {
      // Asegúrate de que this.usuariosSeleccionados es un array
      if (Array.isArray(this.usuariosSeleccionados)) {
        let users = this.usuariosSeleccionados;
        users.push({ UsuarioID: this.creador, Nombre: '' });
        this.proyectosService.updateProyectoUsuarios(this.ProyectoID, { users: users }).subscribe(data => {
          this.getProyecto();
        });
      }
    });
  }

  eliminarProyecto() {
    this.proyectosService
      .eliminarProyecto(this.proyecto.ProyectoID)
      .subscribe((data) => {
        this.router.navigate(['innovacion/proyectos']);
      });
  }

  get avanceProyecto(): number {
    const total = this.tareas.length;
    if (total === 0) return 0;
    const completadas = this.tareas.filter(t => t.Estado == "completado").length;
    const porcentaje = (completadas / total) * 100;
    return porcentaje;
  }


  /* Tareas */
  getTareas() {
    this.proyectosService.getTareasPorProyecto(this.proyecto.ProyectoID).subscribe((data) => {
        this.tareas = data;
      });
  }

  addTarea() {
    this.tareaAdd = !this.tareaAdd;
    setTimeout(() => {
      initFlowbite();
    }, 500)
  }

  crearTarea() {
    const datos = {
      proyectoID: this.proyecto.ProyectoID,
      titulo: this.tituloTarea,
      descripcion: this.descripcionTarea,
      estado: 'planeacion',
      fechaLimite: this.dateTarea,
    };
    this.proyectosService.setTarea(datos).subscribe((data: any) => {
      this.tituloTarea = '';
      this.descripcionTarea = '';
      for (let usuario of this.proyecto.Usuarios) {
        if (usuario.tarea) {
          const datos = { "tareaID": data.taskID, "usuarioID": usuario.UsuarioID }
          this.proyectosService.setTareasUsuarios(datos).subscribe(data => { this.getTareas() });
          usuario.tarea = false;
        }
      }
      this.getTareas()

    });
  }

  eliminarTarea(tareaId: number) {
    this.proyectosService.eliminarTarea(tareaId).subscribe((data) => {
      this.getTareas();
    });
  }


  /* Usuarios */
  ActualizarUsuarios() {
    this.usuarios = this.usuarios.map((usuario) => {
      // Verificar si el usuario actual está en la lista de usuarios del proyecto
      const estaSeleccionado = this.proyecto.Usuarios.some(
        (proyectoUsuario: any) =>
          proyectoUsuario.UsuarioID === usuario.UsuarioID
      );

      // Retornar el usuario con la propiedad 'seleccionado' actualizada
      return {
        ...usuario,
        seleccionado: estaSeleccionado,
      };
    });
    this.usuariosFiltrados = this.usuarios;
  }

  filtroUsuario() {
    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.Nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  borrarFilto() {
    this.filtro = '';
    this.usuariosFiltrados.map((u) => (u.seleccionado = false));
    this.usuariosFiltrados = this.usuarios;
  }

  get usuariosSeleccionados(): Usuario[] {
    return this.usuarios.filter((usuario) => usuario.seleccionado);
  }

  goBack() {
    window.history.back();
  }
}
