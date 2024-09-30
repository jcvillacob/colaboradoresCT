import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantenimientoMainComponent } from './components/mantenimiento-main/mantenimiento-main.component';
import { MantenimientoHomeComponent } from './components/mantenimiento-home/mantenimiento-home.component';
import { NovedadesComponent } from './components/mantenimiento-novedades/novedades/novedades.component';
import { CrucesComponent } from './components/mantenimiento-novedades/cruces/cruces.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MantenimientoMainComponent,
    MantenimientoHomeComponent,
    NovedadesComponent,
    CrucesComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    FormsModule
  ]
})
export class MantenimientoModule { }
