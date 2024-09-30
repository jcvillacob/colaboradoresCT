import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenimientoHomeComponent } from './components/mantenimiento-home/mantenimiento-home.component';
import { AuthGuard } from 'src/app/core/authentication/auth.guard';
import { CrucesComponent } from './components/mantenimiento-novedades/cruces/cruces.component';

const routes: Routes = [
  { path: '', component: MantenimientoHomeComponent},
  { path: 'novedades-combustible', component: CrucesComponent, canActivate: [AuthGuard], data: { subroles: ['Aprobar Cruces']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
