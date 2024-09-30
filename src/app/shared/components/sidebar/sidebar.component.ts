import { AfterViewInit, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit{
  usuarioLogged: any = {}

  constructor(private authService: AuthService) {
    this.usuarioLogged = this.authService.usuarioLogged;
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  tieneRol(rol: string): boolean {
    const hasRole = this.authService.tieneRol(rol);
    return hasRole;
  }

  tieneSubrol(subrol: string) {
    const hasSubrole = this.authService.tieneSubrol(subrol);
    return hasSubrole;
  }

  // Método para manejar el cierre de sesión
  logout() {
    this.authService.logout();
  }

}
