import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { InformesRoutingModule } from './informes-routing.module';
import { VentasComponent } from './components/ventas/ventas.component';

@NgModule({
  declarations: [VentasComponent],
  imports: [CommonModule, InformesRoutingModule, FormsModule],
})
export class InformesModule {}
