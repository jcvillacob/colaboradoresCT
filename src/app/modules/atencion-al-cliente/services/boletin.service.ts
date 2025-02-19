import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoletinService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getBoletines(): Observable<any[]> {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const mesFormateado = `${year}-${month}`;
    return this.http.get<any[]>(`${this.apiUrl}/boletin?mes=${mesFormateado}`);
  }

  createBoletin(boletinData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/boletin/`, boletinData);
  }
}
