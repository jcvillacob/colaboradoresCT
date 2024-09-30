import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { InnovacionRoutingModule } from './innovacion-routing.module';



import { InnovacionMainComponent } from './components/innovacion-main/innovacion-main.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { ProyectoDetalleModalComponent } from './components/proyectos/proyecto-detalle-modal/proyecto-detalle-modal.component';
import { CrearProyectoModalComponent } from './components/proyectos/crear-proyecto-modal/crear-proyecto-modal.component';
import { TareasProyectoComponent } from './components/tareas/tareas-proyecto/tareas-proyecto.component';
import { TareasUsuarioComponent } from './components/tareas/tareas-usuario/tareas-usuario.component';
import { TodasTareasComponent } from './components/tareas/todas-tareas/todas-tareas.component';
import { InnovacionHomeComponent } from './components/innovacion-home/innovacion-home.component';
import { TareasDetallesComponent } from './components/tareas/tareas-detalles/tareas-detalles.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsViewComponent } from './components/projects-view/projects-view.component';


@NgModule({
  declarations: [
    InnovacionMainComponent,
    ProyectosComponent,
    TareasComponent,
    ProyectoDetalleModalComponent,
    CrearProyectoModalComponent,
    TareasProyectoComponent,
    TareasUsuarioComponent,
    TodasTareasComponent,
    InnovacionHomeComponent,
    TareasDetallesComponent,
    ProjectsViewComponent
  ],
  imports: [
    CommonModule,
    InnovacionRoutingModule,
    DragDropModule,
    FormsModule,
    SharedModule
  ]
})
export class InnovacionModule { }
