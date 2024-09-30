import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiredRoles = route.data['roles'] ? route.data['roles'] as Array<any> : [];
    const requiredSubroles = route.data['subroles'] ? route.data['subroles'] as Array<any> : [];

    return this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(false);
        }
        // Usa zip para combinar los observables de roles y subroles
        return zip(
          this.authService.getUsuarioRoles(),
          this.authService.getUsuarioSubroles()
        ).pipe(
          map(([userRoles, userSubroles]) => {
            // Verifica si el usuario tiene algún rol requerido
            const hasRequiredRole = requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role.NombreRol) || role.NombreRol === 'Administrador');
            if (!hasRequiredRole) {
              this.router.navigate(['/']);
              return false;
            }

            // Verifica si el usuario tiene algún subrol requerido
            const hasRequiredSubrole = requiredSubroles.length === 0 || userSubroles.some(subrole => requiredSubroles.includes(subrole.NombreSubrol)) || userRoles.some(role => role.NombreRol === 'Administrador');
            if (!hasRequiredSubrole) {
              this.router.navigate(['/']);
              return false;
            }

            return true;
          })
        );
      })
    );
  }
}
