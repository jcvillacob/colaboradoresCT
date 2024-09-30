import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancieraRoutingModule } from './financiera-routing.module';
import { NovedadesCarteraComponent } from './components/novedades-cartera/novedades-cartera.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NovedadesCarteraComponent
  ],
  imports: [
    CommonModule,
    FinancieraRoutingModule,
    FormsModule
  ]
})
export class FinancieraModule { }
