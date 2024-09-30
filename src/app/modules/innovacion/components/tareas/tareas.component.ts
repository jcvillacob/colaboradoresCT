import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  vistaActual: string = 'proyectos';

  constructor(private proyectosService: ProyectosService) { }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }

  ngOnInit() {
  }


}
