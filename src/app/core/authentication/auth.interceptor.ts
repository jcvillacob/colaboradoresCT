import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth.reducer';
import * as AuthActions from './store/auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser?.token;

    // Clonamos la solicitud HTTP para añadir el token al encabezado
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Pasamos la solicitud al siguiente manejador, interceptando la respuesta
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (!req.url.includes('/login')) {
            this.store.dispatch(AuthActions.autoLogin());
          }

          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
