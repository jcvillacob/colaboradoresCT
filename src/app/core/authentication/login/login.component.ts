import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
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


  constructor(private authService: AuthService, private store: Store) { }

  login() {
    this.cargando = true;
    this.store.dispatch(AuthActions.login({ username: this.username, password: this.password }));
    setTimeout(() => {
      this.cargando = false;
    }, 5000);
    /* this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        console.log('Login exitoso', data);
        this.cargando = false;
      },
      error: (error) => {
        this.showToast = true;
        this.cargando = false;
        setTimeout(() => {
          this.showToast = false;
        }, 5000);
      }
    }); */
  }

  closeToast() {
    this.showToast = false;
  }


}
