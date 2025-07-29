import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancieraRoutingModule } from './financiera-routing.module';
import { NovedadesCarteraComponent } from './components/novedades-cartera/novedades-cartera.component';
import { FormsModule } from '@angular/forms';
import { ConciliacionDiariaComponent } from './components/conciliacion-diaria/conciliacion-diaria.component';
import { FacturacionManualComponent } from './components/terpel/facturacion-manual/facturacion-manual.component';
import { RndcComponent } from './components/terpel/rndc/rndc.component';
import { TerpelComponent } from './components/terpel/terpel.component';

@NgModule({
  declarations: [
    NovedadesCarteraComponent,
    TerpelComponent,
    RndcComponent,
    FacturacionManualComponent,
    ConciliacionDiariaComponent,
  ],
  imports: [CommonModule, FinancieraRoutingModule, FormsModule],
})
export class FinancieraModule {}
