import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable()
export class AuthEffects {
  // Efecto para manejar el inicio de sesión
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.username, action.password).pipe(
          mergeMap((response: any) => {
            console.log('effect');
            if (response && response.token) {
              localStorage.setItem('currentUser', JSON.stringify(response));
              const user = this.decodeToken(response.token);
              // Obtener roles y subroles si es necesario
              return forkJoin({
                roles: "",
                subroles: "",
              }).pipe(
                map(({ roles, subroles }) => {
                  user.roles = roles;
                  user.subroles = subroles;
                  return AuthActions.loginSuccess({ user });
                })
              );
            } else {
              return of(AuthActions.loginFailure({ error: 'Credenciales inválidas' }));
            }
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  // Efecto para manejar el inicio de sesión automático
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const decodedToken = this.decodeToken(userData.token);
          if (decodedToken && this.isTokenValid(decodedToken.exp)) {
            // Obtener roles y subroles
            return AuthActions.loginSuccess({ user: decodedToken });
          } else {
            // Token inválido o expirado
            return AuthActions.logout();
          }
        } else {
          return AuthActions.logout();
        }
      })
    )
  );

  // Efectos para manejar el éxito y fallo de inicio de sesión
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      console.error('Error decodificando el token', Error);
      return null;
    }
  }

  private isTokenValid(exp: number): boolean {
    const now = Date.now().valueOf() / 1000;
    return exp > now;
  }
}
