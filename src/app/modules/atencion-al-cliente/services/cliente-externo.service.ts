import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteExternoService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /* NOTICIAS */
  getNoticias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/noticias`);
  }

  getNoticia(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/noticias/${id}`);
  }

  crearNoticia(noticiaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/noticias`, noticiaData);
  }

  actualizarNoticia(NoticiaID: number, noticiaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/noticias/${NoticiaID}`, noticiaData);
  }

  eliminarNoticia(noticiaID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/noticias/${noticiaID}`);
  }


  /* BLOGS */
  getApiUpload(): string {
    return `${this.apiUrl}/blogs/upload`
  }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogs`);
  }

  getBlog(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogs/${id}`);
  }

  crearBlog(blogData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/blogs`, blogData);
  }

  actualizarBlog(blogDataID: number, noticiaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/blogs/${blogDataID}`, noticiaData);
  }

  eliminarBlog(blogDataID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blogs/${blogDataID}`);
  }

  // Método para eliminar imágenes temporales
  deleteTemporaryImages(imageUrls: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/blogs/delete-temporary-images`, { images: imageUrls });
  }


  /* PQRS */
  getPqrs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pqrs`);
  }

  getPqr(PqrsID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pqrs/${PqrsID}`);
  }

  crearPqrs(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/pqrs`, data);
  }

  deletePqrs(pqrsID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pqrs/${pqrsID}`);
  }

}
