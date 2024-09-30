import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConductoresService {

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

  deleteNovedad(novedadId: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/novedades/${novedadId}`);
  }


  returnPDF(originalUrl: string) {
    const lastSlashIndex = originalUrl.lastIndexOf('/');
    if (lastSlashIndex === -1) return originalUrl;
    const name = originalUrl.substring(lastSlashIndex + 1);
    return `${this.apiUrl}/capacitaciones/pdf/${name}`;
  }

  getAllCapacitaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/capacitaciones`);
  }

  getCapacitacionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/capacitaciones/${id}`);
  }

  createCapacitacion(capacitacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/capacitaciones`, capacitacion);
  }

  updateCapacitacion(id: number, capacitacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/capacitaciones/${id}`, capacitacion);
  }

  deleteCapacitacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/capacitaciones/${id}`);
  }

}
