import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CausacionesActions from './causaciones.actions';
import { CausacionesService } from '../services/causaciones.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CausacionesEffects {
  constructor(
    private actions$: Actions,
    private causacionesService: CausacionesService
  ) {}

  loadFacturas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CausacionesActions.loadFacturas),
      mergeMap(() =>
        this.causacionesService.getFacturas().pipe(
          map(facturas => CausacionesActions.loadFacturasSuccess({ facturas })),
          catchError(error => of(CausacionesActions.loadFacturasFailure({ error })))
        )
      )
    )
  );

  loadFactura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CausacionesActions.loadFactura),
      mergeMap(action =>
        this.causacionesService.getFacturaById(action.id).pipe(
          map(factura => CausacionesActions.loadFacturaSuccess({ factura })),
          catchError(error => of(CausacionesActions.loadFacturaFailure({ error })))
        )
      )
    )
  );

  causeFactura$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CausacionesActions.causeFactura),
      mergeMap(action =>
        this.causacionesService.postCausacion(action.factura).pipe(
          map(response => {
            console.log('Causación realizada:', response, action.factura);
            return CausacionesActions.causeFacturaSuccess({ response,  factura: action.factura });
          }),
          catchError(error => of(CausacionesActions.causeFacturaFailure({ error })))
        )
      )
    )
  );
}
