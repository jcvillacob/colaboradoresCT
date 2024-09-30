import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tareas-detalles',
  templateUrl: './tareas-detalles.component.html',
  styleUrls: ['./tareas-detalles.component.scss']
})
export class TareasDetallesComponent implements OnInit {
  TareaID!: number;
  tarea: any = {Titulo: '', Descripcion: '', Estado: '', FechaLimite: ''};
  nuevaTarea: any = {titulo: '', descripcion: '', estado: '', fechaLimite: ''};
  subtareas: any[] = [];
  subtareaAdd = false;
  tituloSubtarea!: string;

  filtro = '';
  usuarios: any[] = [];
  usuariosFiltrados: any[] = this.usuarios;
  creador = 1;

  constructor(
    private proyectosService: ProyectosService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    const tareaID = this.route.snapshot.paramMap.get('id');
    if (tareaID) {
      this.TareaID = +tareaID;
      this.getTarea();
      this.getSubtareas();
    }
    initFlowbite();
  }

  /* Tarea */
  getTarea() {
    this.proyectosService.getTarea(this.TareaID).subscribe((data) => {
      this.tarea = data;
      this.nuevaTarea = { titulo: this.tarea.Titulo, descripcion: this.tarea.Descripcion, estado: this.tarea.Estado, fechaLimite: this.tarea.FechaLimite }
      this.proyectosService.getProyecto(data.Proyecto.ProyectoID).subscribe((data: any) => {
        this.usuarios = data.Usuarios;
        this.usuariosFiltrados = this.usuarios;
        this.ActualizarUsuarios();
      });
    });
  }

  updateTarea() {
    this.proyectosService.updateTarea(this.TareaID, this.nuevaTarea).subscribe((data) => {
      let users = this.usuariosSeleccionados;
      this.proyectosService.updateTareasUsuarios(this.TareaID, { users: users }).subscribe(data => {
        this.getTarea();
      })
    });
  }

  eliminarTarea() {
    this.proyectosService.eliminarTarea(this.TareaID).subscribe(data => {
      this.goBack();
    })
  }

  get avanceTarea(): number {
    const total = this.subtareas.length;
    if (total === 0) return 0;
    const completadas = this.subtareas.filter(s => s.Completada).length;
    const porcentaje = (completadas / total) * 100;
    return porcentaje;
  }



  /* Subtareas */
  addSubtarea() {
    this.subtareaAdd = !this.subtareaAdd;
  }

  getSubtareas() {
    this.proyectosService.getSubtareas(this.TareaID).subscribe(data => {
      this.subtareas = data;
    })
  }

  crearSubtarea() {
    const datos = { tareaID: this.TareaID, descripcion: this.tituloSubtarea, completada: 0 };
    this.proyectosService.setSubtarea(datos).subscribe(data => {
      this.tituloSubtarea = '';
      this.getSubtareas();
    })
  }

  completarSubtarea(Subtarea: any) {
    const datos = { descripcion: Subtarea.Descripcion, completada: !Subtarea.Completada };
    this.proyectosService.completeSubtarea(Subtarea.SubtareaID, datos).subscribe(data => {
      this.getSubtareas();
    })
  }

  eliminarSubtarea(SubtareaID: number){
    this.proyectosService.deleteSubtarea(SubtareaID).subscribe(data => {
      this.getSubtareas();
    })
  }

  /* Usuarios */
  ActualizarUsuarios() {
    this.usuarios = this.usuarios.map((usuario) => {
      // Verificar si el usuario actual está en la lista de usuarios de la tarea
      const estaSeleccionado = this.tarea.Usuarios.some(
        (tareaUsuario: any) =>
        tareaUsuario.UsuarioID === usuario.UsuarioID
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

  get usuariosSeleccionados(): any[] {
    return this.usuarios.filter((usuario) => usuario.seleccionado);
  }

  goBack() {
    window.history.back();
  }
}
