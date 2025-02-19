import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovedadesCarteraComponent } from './components/novedades-cartera/novedades-cartera.component';
import { TerpelComponent } from './components/terpel/terpel.component';
import { AuthGuard } from 'src/app/core/authentication/auth.guard';

const routes: Routes = [
  {path: 'novedades-cartera', component: NovedadesCarteraComponent, canActivate: [AuthGuard], data: { subroles: ['Novedades Cartera']} },
  {path: 'facturacion-terpel', component: TerpelComponent, canActivate: [AuthGuard], data: { subroles: ['Facturacion Terpel']} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancieraRoutingModule { }
