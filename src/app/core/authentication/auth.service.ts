import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl: string = environment.apiURL;
  public usuarioLogged: any = {};

  constructor(private http: HttpClient, private router: Router) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const decodedToken = this.decodeToken(userData.token);
      if (decodedToken && this.isTokenValid(decodedToken.exp)) {
        this.usuarioLogged = decodedToken;
        this.isLoggedIn.next(true);
      } else {
        this.logout();
      }
    } else if (environment.skipLogin) {
      // La lógica para el caso de skipLogin permanece igual
      this.isLoggedIn.next(true);
      this.usuarioLogged = {
        "UsuarioID": 1,
        "Username": "jvillacob",
        "Nombre": "Juan Camilo Villacob",
        "Cedula": "1100551122",
        "iat": 1710430791,
        "exp": 1710448791,
        "roles": [
          {
            "RolID": 23,
            "NombreRol": "Administrador",
            "Descripcion": ""
          }
        ],
        "subroles": []
      };
    }
  }

  private isTokenValid(exp: number): boolean {
    const now = Date.now().valueOf() / 1000;
    return exp > now;
  }

  /*   private loadUserRolesAndSubroles(usuarioID: number) {
      this.getUsuarioRol(usuarioID).subscribe(data => {
        this.usuarioLogged['roles'] = data;
        if (usuarioID === 0) {
          this.usuarioLogged['roles'] = [{ NombreRol: 'Conductor' }];
        }
        this.getUsuarioSubrol(usuarioID).subscribe(data => {
          this.usuarioLogged['subroles'] = data;
        });
      });
    } */

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.usuarioLogged = {};
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn$ = this.isLoggedIn.asObservable();

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      console.error('Error decodificando el token', Error);
      return null;
    }
  }

  public getUsuarioID() {
    return this.usuarioLogged.UsuarioID;
  }

  private getUsuarioRol(UsuarioID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioRoles/${UsuarioID}`);
  }

  public getUsuarioRoles(): Observable<any[]> {
    return of(this.usuarioLogged.roles || []);
  }

  public tieneRol(rolRequerido: string): boolean {
    let roles = [];
    if (this.usuarioLogged.roles !== undefined) {
      roles = this.usuarioLogged.roles.map((rol: any) => rol.NombreRol);
    }
    return roles.includes(rolRequerido) || roles.includes('Administrador');
  }



  private getUsuarioSubrol(UsuarioID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioSubroles/${UsuarioID}`);
  }

  public getUsuarioSubroles(): Observable<any[]> {
    return of(this.usuarioLogged.subroles || []);
  }

  public tieneSubrol(subrolRequerido: string): boolean {
    let subroles = [];
    let roles = [];
    if (this.usuarioLogged.roles !== undefined && this.usuarioLogged.subroles !== undefined) {
      subroles = this.usuarioLogged.subroles.map((subrol: any) => subrol.NombreSubrol);
      roles = this.usuarioLogged.roles.map((rol: any) => rol.NombreRol);
    }
    return subroles.includes(subrolRequerido) || roles.includes('Administrador');
  }
}
