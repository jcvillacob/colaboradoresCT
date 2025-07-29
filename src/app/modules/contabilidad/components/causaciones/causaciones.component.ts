import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Causacion } from '../../models/causacion.model';
import { Store } from '@ngrx/store';
import * as CausacionesActions from '../../store/causaciones.actions';
import { CausacionesState } from '../../store/causaciones.reducer';

@Component({
  selector: 'app-causaciones',
  templateUrl: './causaciones.component.html',
  styleUrls: ['./causaciones.component.scss']
})
export class CausacionesComponent implements OnInit {
  // Filtros y selector
  searchTerm: string = '';
  selectedSort: string = '';

  // Nuevos campos del formulario del modal
  nombreServicio: string = '';
  retencionFuente: string = '';
  reteica: string = '';

  // Observables del store para la lista y la factura seleccionada
  facturas$: Observable<Causacion[]>;
  selectedFactura$: Observable<Causacion | null>;

  constructor(private store: Store<{ causaciones: CausacionesState }>) {
    this.facturas$ = this.store.select(state => state.causaciones.facturas);
    this.selectedFactura$ = this.store.select(state => state.causaciones.selectedFactura);
  }

  ngOnInit(): void {
    // Cargar todas las facturas al iniciar
    this.store.dispatch(CausacionesActions.loadFacturas());
  }

  // Método para filtrar y ordenar la lista (por entidad o radicado)
  filterAndSort(facturas: Causacion[]): Causacion[] {
    let filtered = facturas.filter(c =>
      c.entidad.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.radicado.includes(this.searchTerm)
    );

    switch (this.selectedSort) {
      case 'fechaAsc':
        filtered.sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
        break;
      case 'fechaDesc':
        filtered.sort((a, b) => new Date(b.fechaVencimiento).getTime() - new Date(a.fechaVencimiento).getTime());
        break;
      case 'valorAsc':
        filtered.sort((a, b) => a.valor - b.valor);
        break;
      case 'valorDesc':
        filtered.sort((a, b) => b.valor - a.valor);
        break;
      default:
        break;
    }
    return filtered;
  }

  // Despacha la acción para cargar la factura individual (al abrir el modal)
  onLoadFactura(id: string) {
    this.store.dispatch(CausacionesActions.loadFactura({ id }));
  }

  // Envío del formulario del modal. Se crea un payload que extiende la factura actual
  onSubmitCausacion(factura: Causacion) {
    const payload = {
      ...factura,
      nombreServicio: this.nombreServicio,
      retencionFuente: this.retencionFuente,
      reteica: this.reteica
    };
    this.store.dispatch(CausacionesActions.causeFactura({ factura: payload }));
    // Reiniciar los campos del formulario
    this.nombreServicio = '';
    this.retencionFuente = '';
    this.reteica = '';
  }

  // Cierra el modal y resetea el formulario
  cerrarModal() {
    this.store.dispatch(CausacionesActions.clearSelectedFactura());
    this.nombreServicio = '';
    this.retencionFuente = '';
    this.reteica = '';
  }
}
