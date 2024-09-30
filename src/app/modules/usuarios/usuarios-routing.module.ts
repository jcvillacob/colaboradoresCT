import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosDetallesComponent } from './components/usuarios-detalles/usuarios-detalles.component';
import { UsuariosHomeComponent } from './components/usuarios-home/usuarios-home.component';

const routes: Routes = [
  { path: '', component: UsuariosHomeComponent},
  { path: 'detalles/:id', component: UsuariosDetallesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
