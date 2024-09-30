import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ProyectosService } from '../../../services/proyectos.service';

interface Tarea {
  id: number;
  titulo: string;
  estado: string;
}

@Component({
  selector: 'app-tareas-proyecto',
  templateUrl: './tareas-proyecto.component.html',
  styleUrls: ['./tareas-proyecto.component.scss']
})
export class TareasProyectoComponent implements OnInit {
  proyectos: any[] = [];
  tareas: Tarea[] = [];
  spinner: boolean = true;

  constructor(private proyectosService: ProyectosService) {
    this.proyectosService.getProyectos().subscribe(data => {
      this.proyectos = data.reverse();
      this.proyectos.forEach(project => {
        this.proyectosService.getTareasPorProyecto(project.ProyectoID).subscribe(tareas => {
          project.Tareas = tareas;
          // Agregar las nuevas listas de tareas organizadas por estado
          project.porHacer = tareas.filter(t => t.Estado === 'planeacion');
          project.enProgreso = tareas.filter(t => t.Estado === 'enProgreso');
          project.completado = tareas.filter(t => t.Estado === 'completado');
        });
      });
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  ngOnInit() {

  }

  onDrop(event: CdkDragDrop<Tarea[]>, project: any, nuevoEstado: string) {
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

    // Actualizar el estado de la tarea movida
    const tareaMovida = event.container.data[event.currentIndex];
    this.actualizarEstadoTarea(tareaMovida, nuevoEstado);
  }

  actualizarEstadoTarea(tarea: any, nuevoEstado: string) {
    this.proyectosService.setState(tarea.TareaID, {estado: nuevoEstado}).subscribe(data => {
    })
  }

  convertHexToRGBA(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
  }

}
