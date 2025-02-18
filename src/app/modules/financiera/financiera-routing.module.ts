import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovedadesCarteraComponent } from './components/novedades-cartera/novedades-cartera.component';
import { TerpelComponent } from './components/terpel/terpel.component';

const routes: Routes = [
  {path: 'novedades-cartera', component: NovedadesCarteraComponent},
  {path: 'facturacion-terpel', component: TerpelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancieraRoutingModule { }
