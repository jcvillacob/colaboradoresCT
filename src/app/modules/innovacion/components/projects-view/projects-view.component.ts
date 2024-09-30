import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-projects-view',
  templateUrl: './projects-view.component.html',
  styleUrls: ['./projects-view.component.scss']
})
export class ProjectsViewComponent implements OnInit {
  proyectos!: any[];
  proyectosSelected!: any[];
  spinner: boolean = true;
  tooltipProjectId: number | null = null;
  estadoFiltro = -1;
  filtro!: string;

  constructor(private proyectosService: ProyectosService) {
    this.proyectosService.getViewProyectos().subscribe(data => {
      this.proyectos = data.reverse();
      this.proyectosSelected = data.reverse();
      setTimeout(() => {
        this.spinner = false;
      }, 700);
    });
  }

  ngOnInit(): void {
      initFlowbite();
  }

  getProgress(tareas: any[]): number {
    const totalTareas = tareas.length;
    if(totalTareas === 0) {
      return 0;
    };
    const tareasCompletadas = tareas.filter(tarea => tarea.Estado === 'completado').length;
    return (tareasCompletadas / totalTareas) * 100;
  }

  getState(tareas: any[]): string {
    const totalTareas = tareas.length;
    if(totalTareas === 0) {
      return 'En Planeación';
    };
    const tareasCompletadas = tareas.filter(tarea => tarea.Estado === 'completado').length;
    const tareasProgreso = tareas.filter(tarea => tarea.Estado === 'enProgreso').length;
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

  showTooltip(id: number) {
    this.tooltipProjectId = id;
  }

  hideTooltip() {
    this.tooltipProjectId = null;
  }

  filtrarProyectos(estado: number) {
    this.spinner = true;
    this.estadoFiltro = estado;
    setTimeout(() => {
      this.spinner = false;
    }, 300);
  }

  filtroProyectos() {
    if (this.filtro) {
      this.proyectosSelected = this.proyectos.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const nombreContieneFiltro = elemento.Nombre.toLowerCase().includes(filtroMinuscula);
        return nombreContieneFiltro;
      });
    } else {
      this.proyectosSelected = this.proyectos;
    }
  }
}
