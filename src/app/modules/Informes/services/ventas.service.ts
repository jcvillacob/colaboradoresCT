import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /* NOVEDADES */
  getDatosVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produccion/ventas`);
  }

 
}
