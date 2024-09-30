import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComercialService {
  private apiUrl: string = environment.apiURL;

  constructor(private http: HttpClient) { }

  /* Solicitudes de Cotización */
  getSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cotizaciones`);
  }

  deleteSolicitudes(solicitudID: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/cotizaciones/${solicitudID}`);
  }

}
