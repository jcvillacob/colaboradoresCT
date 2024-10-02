import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/core/authentication/store/auth.reducer';
import { Store } from '@ngrx/store';

interface Usuario {
  UsuarioID: number;
  Nombre: string;
  seleccionado?: boolean;
}

@Component({
  selector: 'app-crear-proyecto-modal',
  templateUrl: './crear-proyecto-modal.component.html',
  styleUrls: ['./crear-proyecto-modal.component.scss'],
})
export class CrearProyectoModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  icons: { class: string, name: string }[] = [];
  nuevoProyecto = { color: '#000000', icono: '', nombre: '', descripcion: '' };
  filtro = '';
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = this.usuarios;
  creador!: any;
  userLogged$!: Observable<any>;


  constructor(private proyectosService: ProyectosService, private authService: AuthService, private cdr: ChangeDetectorRef, private store: Store<{ auth: AuthState }>) {
    this.userLogged$ = this.store.select(state => state.auth.user);
    this.proyectosService.getUsuarios().subscribe(data => {
      this.usuarios = data.filter(u => u.UsuarioID != this.creador);
      this.usuariosFiltrados = this.usuarios;
      this.icons = this.proyectosService.icons;
      this.creador = this.userLogged$.subscribe(user => {
        return user.UsuarioID
      });
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }

  cerrarCrear() {
    this.close.emit();
  }

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
        this.proyectosService.setProyectoUsuarios(respuesta.proyectoID, usuario).subscribe(data => { this.cerrarCrear(); });
        this.cerrarCrear();
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
