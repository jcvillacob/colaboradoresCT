import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { ProyectoDetalleModalComponent } from './components/proyectos/proyecto-detalle-modal/proyecto-detalle-modal.component';
import { InnovacionHomeComponent } from './components/innovacion-home/innovacion-home.component';
import { TareasDetallesComponent } from './components/tareas/tareas-detalles/tareas-detalles.component';
import { ProjectsViewComponent } from './components/projects-view/projects-view.component';
import { AuthGuard } from 'src/app/core/authentication/auth.guard';

const routes: Routes = [
  { path: '', component: InnovacionHomeComponent },
  { path: 'tareas', component: TareasComponent, canActivate: [AuthGuard], data: { subroles: ['Equipo Innovacion'] } },
  { path: 'tareas/detalles/:id', component: TareasDetallesComponent, canActivate: [AuthGuard], data: { subroles: ['Equipo Innovacion'] } },
  { path: 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard], data: { subroles: ['Equipo Innovacion'] } },
  { path: 'proyectos/detalles/:id', component: ProyectoDetalleModalComponent, canActivate: [AuthGuard], data: { subroles: ['Equipo Innovacion'] } },
  { path: 'ver-proyectos', component: ProjectsViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovacionRoutingModule { }
