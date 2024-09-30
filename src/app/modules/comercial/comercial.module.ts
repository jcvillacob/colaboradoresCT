import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComercialRoutingModule } from './comercial-routing.module';
import { ComercialMainComponent } from './components/comercial-main/comercial-main.component';
import { FormsModule } from '@angular/forms';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';


@NgModule({
  declarations: [
    ComercialMainComponent,
    SolicitudesComponent
  ],
  imports: [
    CommonModule,
    ComercialRoutingModule,
    FormsModule
  ]
})
export class ComercialModule { }
