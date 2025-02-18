// src/app/services/causaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Causacion } from '../models/causacion.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CausacionesService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  // Llama al endpoint GET para obtener todas las facturas
  getFacturas(): Observable<Causacion[]> {
    return this.http.get<Causacion[]>(`${this.apiUrl}/causaciones/facturas`);
  }

  // Llama al endpoint GET para obtener una factura por ID
  getFacturaById(id: string): Observable<Causacion> {
    return this.http.get<Causacion>(`${this.apiUrl}/causaciones/facturas/${id}`);
  }

  // Llama al endpoint POST para actualizar la causación
  postCausacion(factura: Causacion): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/causaciones/causacion/actualizar`, factura);
  }
}
