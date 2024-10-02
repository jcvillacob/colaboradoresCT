import { CanActivateFn, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth.reducer';
import { map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(state => state.auth.user).pipe(
    map(user => {
      if (user) {
        return router.createUrlTree(['/home']);
      }
      return true;
    })
  );
};
