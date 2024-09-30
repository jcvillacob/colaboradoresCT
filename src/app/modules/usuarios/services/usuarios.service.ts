import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /* Usuarios */
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuario(UsuarioID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${UsuarioID}`);
  }

  actualizarBuk(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/actualizarBuk`);
  }

  createUsuario(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, data);
  }

  updateUsuario(UsuarioID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${UsuarioID}`, data);
  }

  updateStateUsuario(UsuarioID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/estado/${UsuarioID}`, data);
  }

  updateDataUsuario(UsuarioID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/userdata/${UsuarioID}`, data);
  }

  deleteUsuario(UsuarioID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${UsuarioID}`);
  }


  /* Roles */
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  getRol(RolID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles/${RolID}`);
  }

  createRol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles`, data);
  }

  updateRol(RolID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/roles/${RolID}`, data);
  }

  deleteRol(RolID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/roles/${RolID}`);
  }


  /* Subroles */
  getSubroles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subroles`);
  }

  getSubrol(SubrolID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/subroles/${SubrolID}`);
  }

  createSubrol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subroles`, data);
  }

  updateSubrol(SubrolID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/subroles/${SubrolID}`, data);
  }

  deleteSubrol(SubrolID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/subroles/${SubrolID}`);
  }


  /* Usuario-Roles */
  assignRol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarioRoles/assign`, data);
  }

  removeRol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarioRoles/remove`, data);
  }

  getUsuarioRol(UsuarioID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioRoles/${UsuarioID}`);
  }


  /* Usuario-Subrol */
  assignSubrol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarioSubroles/assign`, data);
  }

  removeSubrol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarioSubroles/remove`, data);
  }

  getUsuarioSubrol(UsuarioID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioSubroles/${UsuarioID}`);
  }
}
