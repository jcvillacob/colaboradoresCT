import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { CausacionesComponent } from './components/causaciones/causaciones.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { causacionesReducer } from './store/causaciones.reducer';
import { CausacionesEffects } from './store/causaciones.effects';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [CausacionesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContabilidadRoutingModule,
    StoreModule.forFeature('causaciones', causacionesReducer),
    EffectsModule.forFeature([CausacionesEffects]),
  ],
})
export class ContabilidadModule {}
