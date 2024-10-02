import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { AuthState } from 'src/app/core/authentication/store/auth.reducer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private apiUrl: string = environment.apiURL;
  public icons: { class: string, name: string }[] = [
    { class: 'fa fa-user', name: 'Usuario' },
    { class: 'fa fa-envelope', name: 'Correo' },
    { class: 'fa fa-check', name: 'Verificar' },
    { class: 'fa fa-heart', name: 'Favorito' },
    { class: 'fa fa-money-check-dollar', name: 'Dinero' },
    { class: 'fa fa-credit-card', name: 'Tarjeta' },
    { class: 'fa fa-gear', name: 'Configuración' },
    { class: 'fa fa-wallet', name: 'Cartera' },
    { class: 'fa fa-money-bill-transfer', name: 'Transferencia' },
    { class: 'fa fa-trash', name: 'Eliminar' },
    { class: 'fa fa-plus', name: 'Agregar' },
    { class: 'fa fa-edit', name: 'Editar' },
    { class: 'fa fa-print', name: 'Imprimir' },
    { class: 'fa fa-lock', name: 'Seguridad' },
    { class: 'fa fa-gas-pump', name: 'Gasolinera' },
    { class: 'fa fa-unlock', name: 'Desbloquear' },
    { class: 'fa fa-camera', name: 'Cámara' },
    { class: 'fa fa-save', name: 'Guardar' },
    { class: 'fa fa-refresh', name: 'Actualizar' },
    { class: 'fa fa-route', name: 'Rutas' },
    { class: 'fa fa-map', name: 'Mapa' },
    { class: 'fa fa-search', name: 'Buscar' },
    { class: 'fa fa-folder-open', name: 'Folder' },
    { class: 'fa fa-power-off', name: 'Apagar' },
    { class: 'fa fa-signal', name: 'Señal' },
    { class: 'fa fa-folder-tree', name: 'Arbol de Archivos' },
    { class: 'fa fa-wifi', name: 'WiFi' },
    { class: 'fa fa-battery-full', name: 'Batería' },
    { class: 'fa fa-bell', name: 'Notificaciones' },
    { class: 'fa fa-calendar', name: 'Calendario' },
    { class: 'fa fa-camera-retro', name: 'Cámara Retro' },
    { class: 'fa fa-clipboard', name: 'Portapapeles' },
    { class: 'fa fa-clock', name: 'Reloj' },
    { class: 'fa fa-cloud', name: 'Nube' },
    { class: 'fa fa-comment', name: 'Comentario' },
    { class: 'fa fa-desktop', name: 'Escritorio' },
    { class: 'fa fa-download', name: 'Descargar' },
    { class: 'fa fa-eye', name: 'Ver' },
    { class: 'fa fa-flag', name: 'Bandera' },
    { class: 'fa fa-gift', name: 'Regalo' },
    { class: 'fa fa-headphones', name: 'Auriculares' },
    { class: 'fa fa-key', name: 'Llave' },
    { class: 'fa fa-laptop', name: 'Portátil' },
    { class: 'fa fa-leaf', name: 'Hoja' },
    { class: 'fa fa-magnet', name: 'Imán' },
    { class: 'fa fa-map-marker', name: 'Ubicación' },
    { class: 'fa fa-music', name: 'Música' },
    { class: 'fa fa-pencil', name: 'Lápiz' },
    { class: 'fa fa-image', name: 'Imagen' },
    { class: 'fa fa-plane', name: 'Avión' },
    { class: 'fa fa-soap', name: 'Reproducir' }
  ];
  userLogged$!: Observable<any>;

  constructor(private http: HttpClient, private store: Store<{ auth: AuthState }>) {
    this.userLogged$ = this.store.select(state => state.auth.user)
  }

  /* Proyectos */
  getProyectos(): Observable<any[]> {
    return this.userLogged$.pipe(
      switchMap(user => {
        const usuarioID = user?.UsuarioID;
        console.log(usuarioID);
        return this.http.get<any[]>(`${this.apiUrl}/proyectos/usuario/${usuarioID}`);
      })
    );
  }


  getViewProyectos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyectos/view`);
  }

  getProyecto(ProyectoID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyectos/${ProyectoID}`);
  }

  crearProyecto(proyectoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/proyectos`, proyectoData);
  }

  actualizarProyecto(ProyectoID: number, proyectoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyectos/${ProyectoID}`, proyectoData);
  }

  eliminarProyecto(proyectoID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proyectos/${proyectoID}`);
  }


  /* Proyecto-Usuarios */
  setProyectoUsuarios(ProyectoID: number, UserID: number) {
    const data = {};
    return this.http.post<any[]>(`${this.apiUrl}/proyecto-usuarios/${ProyectoID}/${UserID}`, data);
  }

  updateProyectoUsuarios(ProyectoID: number, users: any) {
    return this.http.put<any[]>(`${this.apiUrl}/proyecto-usuarios/${ProyectoID}/users`, users);
  }


  /* Tareas */
  getTareasPorProyecto(ProyectoID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tareas/proyecto/${ProyectoID}`);
  }

  getTarea(TareaID: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tareas/${TareaID}`);
  }

  setTarea(data: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/tareas`, data);
  }

  setState(TareaID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tareas/estado/${TareaID}`, data);
  }

  updateTarea(TareaID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tareas/${TareaID}`, data)
  }

  eliminarTarea(tareaID: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tareas/${tareaID}`);
  }


  /* Tareas-Usuarios */
  getTareasUsuarios(TareaID: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/tareas-usuarios/task/${TareaID}`);
  }

  setTareasUsuarios(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/tareas-usuarios/asignar`, data);
  }

  updateTareasUsuarios(tareaID: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tareas-usuarios/update/${tareaID}`, data);
  }


  /* Usuarios */
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }


  /* Subtareas */
  getSubtareas(TareaID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subtareas/task/${TareaID}`);
  }

  setSubtarea(data: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/subtareas`, data);
  }

  completeSubtarea(SubtareaID: number, data: any): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/subtareas/${SubtareaID}`, data);
  }

  deleteSubtarea(SubtareaID: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/subtareas/${SubtareaID}`);
  }
}
