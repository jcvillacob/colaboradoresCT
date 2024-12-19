import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CloudfleetService {
  private cloudfleetURL = environment.cloudfleetURL;

  constructor(private http: HttpClient) {}

  getLastLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.cloudfleetURL}/cloudfleet/work-orders/last-logs`);
  }

  updateCloudfleet(): Observable<any[]> {
    return this.http.get<any[]>(`${this.cloudfleetURL}/cloudfleet/work-orders`);
  }
}
