import { AfterViewInit, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AuthState } from '../../../core/authentication/store/auth.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../core/authentication/store/auth.actions';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit{
  usuarioLogged$!: Observable<any>;
  roles$!: Observable<any[]>;
  subroles$!: Observable<any[]>;

  constructor(private authService: AuthService, private store: Store<{ auth: AuthState }>) {
    this.usuarioLogged$ = this.store.select(state => state.auth.user);
    this.roles$ = this.store.select(state => state.auth.roles);
    this.subroles$ = this.store.select(state => state.auth.subroles);
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  tieneRol(rol: string): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => roles.some(r => r.NombreRol === rol))
    );
  }

  tieneSubrol(subrol: string): Observable<boolean> {
    return this.subroles$.pipe(
      map(subroles => subroles.some(s => s.NombreSubrol === subrol))
    );
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

}
