import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<{ auth: AuthState }>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] || [];
    const requiredSubroles = route.data['subroles'] || [];

    return this.store.select(state => state.auth).pipe(
      take(1),
      map(authState => {
        const user = authState.user;
        if (user) {
          const now = Date.now().valueOf() / 1000;
          if (user.exp && user.exp > now) {
            // Verificar roles y subroles
            const hasRequiredRole = requiredRoles.length === 0 || authState.roles.some(role => requiredRoles.includes(role.NombreRol) || role.NombreRol === 'Administrador');

            const hasRequiredSubrole = requiredSubroles.length === 0 || authState.subroles.some(subrole => requiredSubroles.includes(subrole.NombreSubrol)) || authState.roles.some(role => role.NombreRol === 'Administrador');

            if (!hasRequiredRole || !hasRequiredSubrole) {
              this.router.navigate(['/']);
              return false;
            }

            return true;
          } else {
            // Token expirado
            console.log('Token expirado');
            this.store.dispatch(AuthActions.logout());
            return false;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
