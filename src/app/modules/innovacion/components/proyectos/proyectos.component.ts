import { Component, OnInit, ViewChild } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/core/authentication/store/auth.reducer';

interface Usuario {
  UsuarioID: number;
  Nombre: string;
  seleccionado?: boolean;
}

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit {
  proyectos: any[] = [];
  proyectoSeleccionado: any = null;
  spinner: boolean = true;
  userLogged$!: Observable<any>;

  icons: { class: string, name: string }[] = [];
  nuevoProyecto = { color: '#000000', icono: '', nombre: '', descripcion: '' };
  filtro = '';
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = this.usuarios;
  creador!: any;

  constructor(private proyectosService: ProyectosService, private store: Store<{ auth: AuthState }>) {
    this.userLogged$ = this.store.select(state => state.auth.user);
    this.getProyectos();
    this.creador = this.userLogged$.subscribe( user => {
      return user.UsuarioID
    });
    this.proyectosService.getUsuarios().subscribe(data => {
      this.usuarios = data.filter(u => u.UsuarioID != this.creador);
      this.usuariosFiltrados = this.usuarios;
      this.icons = this.proyectosService.icons;
    });
  }

  ngOnInit(): void {
      initFlowbite();
  }

  getProyectos() {
    this.proyectosService.getProyectos().subscribe(data => {
      this.proyectos = data.reverse();
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  convertHexToRGBA(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
  }



  /* Crear Proyecto */
  guardarIcono(clases: string) {
    this.nuevoProyecto.icono = clases;
  }

  crearProyecto() {
    const userIDs = this.usuariosSeleccionados.map(u => u.UsuarioID);
    const proyectoData = {
      nombre: this.nuevoProyecto.nombre,
      descripcion: this.nuevoProyecto.descripcion,
      creadorID: this.creador,
      icono: this.nuevoProyecto.icono,
      color: this.nuevoProyecto.color
    };

    this.proyectosService.crearProyecto(proyectoData).subscribe(respuesta => {
      for (let usuario of userIDs) {
        this.proyectosService.setProyectoUsuarios(respuesta.proyectoID, usuario).subscribe(data => {});
        setTimeout(() => {
          this.getProyectos();
        }, 200);
      }
    });
  }

  filtroUsuario() {
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.Nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  borrarFilto() {
    this.filtro = '';
    this.usuariosFiltrados = this.usuarios;
    this.usuarios.map(u => u.seleccionado = false)
  }

  get usuariosSeleccionados(): Usuario[] {
    return this.usuarios.filter((usuario) => usuario.seleccionado);
  }
}
