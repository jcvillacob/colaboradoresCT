import { createAction, props } from '@ngrx/store';
import { Causacion } from '../models/causacion.model';

export const loadFacturas = createAction('[Causaciones] Load Facturas');

export const loadFacturasSuccess = createAction(
  '[Causaciones] Load Facturas Success',
  props<{ facturas: Causacion[] }>()
);

export const loadFacturasFailure = createAction(
  '[Causaciones] Load Facturas Failure',
  props<{ error: any }>()
);

export const loadFactura = createAction(
  '[Causaciones] Load Factura',
  props<{ id: string }>()
);

export const loadFacturaSuccess = createAction(
  '[Causaciones] Load Factura Success',
  props<{ factura: Causacion }>()
);

export const loadFacturaFailure = createAction(
  '[Causaciones] Load Factura Failure',
  props<{ error: any }>()
);

export const causeFactura = createAction(
  '[Causaciones] Cause Factura',
  props<{ factura: Causacion }>()
);

export const causeFacturaSuccess = createAction(
  '[Causaciones] Cause Factura Success',
  props<{ response: any, factura: Causacion }>()
);

export const causeFacturaFailure = createAction(
  '[Causaciones] Cause Factura Failure',
  props<{ error: any }>()
);

// Acción para limpiar la factura seleccionada (cerrar modal)
export const clearSelectedFactura = createAction('[Causaciones] Clear Selected Factura');
