import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosMainComponent } from './components/usuarios-main/usuarios-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosDetallesComponent } from './components/usuarios-detalles/usuarios-detalles.component';
import { UsuariosHomeComponent } from './components/usuarios-home/usuarios-home.component';


@NgModule({
  declarations: [
    UsuariosMainComponent,
    UsuariosDetallesComponent,
    UsuariosHomeComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
