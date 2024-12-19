import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenimientoHomeComponent } from './components/mantenimiento-home/mantenimiento-home.component';
import { AuthGuard } from 'src/app/core/authentication/auth.guard';
import { CrucesComponent } from './components/mantenimiento-novedades/cruces/cruces.component';
import { ActualizarCloudfleetComponent } from './components/actualizar-cloudfleet/actualizar-cloudfleet.component';

const routes: Routes = [
  { path: '', component: MantenimientoHomeComponent},
  { path: 'novedades-combustible', component: CrucesComponent, canActivate: [AuthGuard], data: { subroles: ['Aprobar Cruces']} },
  { path: 'actualizar-cloudfleet', component: ActualizarCloudfleetComponent, canActivate: [AuthGuard], data: { subroles: ['Actualizar Cloudfleet']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
