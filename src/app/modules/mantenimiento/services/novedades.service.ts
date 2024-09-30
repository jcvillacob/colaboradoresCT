import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /* NOVEDADES */
  getListaNovedades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/novedades/lista`);
  }

  getNovedades(pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/novedades?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  setNovedades(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/novedades`, data);
  }

  /* CRUCES */
  getCruces(pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cruces?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  setCruces(data: any): Observable<any[]> {
    data.tiquete = data.tiquete.toString();
    data.cedula = data.cedula.toString();
    return this.http.post<any[]>(`${this.apiUrl}/cruces?`, data);
  }

  updateAprobacion(id: number, data: any): Observable<any[]>{
    return this.http.put<any[]>(`${this.apiUrl}/cruces/aprobacion/${id}`, data);
  }

  /* COMPROBANTES */
  getComprobante(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comprobantes/${id}`);
  }

  setComprobantes(formData: FormData): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/comprobantes`, formData);
  }

}
