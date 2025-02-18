import { createReducer, on } from '@ngrx/store';
import * as CausacionesActions from './causaciones.actions';
import { Causacion } from '../models/causacion.model';

export interface CausacionesState {
  facturas: Causacion[];
  selectedFactura: Causacion | null;
  loading: boolean;
  error: any;
}

export const initialState: CausacionesState = {
  facturas: [],
  selectedFactura: null,
  loading: false,
  error: null,
};

export const causacionesReducer = createReducer(
  initialState,
  on(CausacionesActions.loadFacturas, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CausacionesActions.loadFacturasSuccess, (state, { facturas }) => ({
    ...state,
    facturas,
    loading: false
  })),
  on(CausacionesActions.loadFacturasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CausacionesActions.loadFactura, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CausacionesActions.loadFacturaSuccess, (state, { factura }) => ({
    ...state,
    selectedFactura: factura,
    loading: false
  })),
  on(CausacionesActions.loadFacturaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CausacionesActions.causeFactura, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CausacionesActions.causeFacturaSuccess, (state, { response, factura }) => ({
    ...state,
    loading: false,
    selectedFactura: null,
    facturas: state.facturas.filter(f => f.radicado !== factura.radicado)
  })),
  on(CausacionesActions.causeFacturaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CausacionesActions.clearSelectedFactura, state => ({
    ...state,
    selectedFactura: null
  }))
);
