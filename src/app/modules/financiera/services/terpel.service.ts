import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerpelService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  // Método para actualizar RNDC (ya existente)
  actualizarRNDC(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/facturacion-terpel/actualizarReporteRNDC`, data);
  }

  // Nuevo método para crear facturación (reportar en BD)
  crearFacturacion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/facturacion-terpel/`, data);
  }
}
