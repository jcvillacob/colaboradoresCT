import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  getApiUpload(): string {
    return `${this.apiUrl}/blogs/upload`
  }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogs`);
  }

  getBlog(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogs/${id}`);
  }

  createBlog(blogData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/blogs`, blogData);
  }

  updateBlog(blogDataID: number, noticiaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/blogs/${blogDataID}`, noticiaData);
  }

  deleteBlog(blogDataID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blogs/${blogDataID}`);
  }

  // Método para eliminar imágenes temporales
  deleteTemporaryImages(imageUrls: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/blogs/delete-temporary-images`, { images: imageUrls });
  }

}
