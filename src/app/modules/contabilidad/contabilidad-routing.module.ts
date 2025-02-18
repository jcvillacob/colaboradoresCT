import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CausacionesComponent } from './components/causaciones/causaciones.component';

const routes: Routes = [
  { path: '', component: CausacionesComponent },
  { path: 'causaciones', component: CausacionesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }
