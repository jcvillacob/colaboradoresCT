import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username!: string;
  password!: string;
  showToast: boolean = false;
  cargando: boolean = false;


  constructor(private store: Store) { }

  login() {
    this.cargando = true;
    this.store.dispatch(AuthActions.login({ username: this.username, password: this.password }));
    setTimeout(() => {
      this.cargando = false;
    }, 2000);
  }

  closeToast() {
    this.showToast = false;
  }
}
