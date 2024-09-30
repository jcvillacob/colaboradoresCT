import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

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


  constructor(private authService: AuthService) { }

  login() {
    this.cargando = true;
    this.authService.login(this.username, this.password).subscribe({
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
    });
  }

  closeToast() {
    this.showToast = false;
  }


}
