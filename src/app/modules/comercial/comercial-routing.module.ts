import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComercialMainComponent } from './components/comercial-main/comercial-main.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { PqrsComponent } from '../atencion-al-cliente/components/pqrs/pqrs.component';

const routes: Routes = [
  { path: 'solicitudes', component: SolicitudesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComercialRoutingModule { }
