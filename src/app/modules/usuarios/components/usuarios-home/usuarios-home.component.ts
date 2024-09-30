import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-home',
  templateUrl: './usuarios-home.component.html',
  styleUrls: ['./usuarios-home.component.scss']
})
export class UsuariosHomeComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  usuarioEdit: any = {};
  filtro: string = '';

  crearRolNombre!: string;
  crearRolDescripcion!: string;
  crearSubrolNombre!: string;
  crearSubrolDescripcion!: string;

  roles: any[] = [];
  rolSeleccionado!: any;
  subroles: any[] = [];
  subrolesSeleccionados: any = {};

  loading = false;


  constructor(private usuariosService: UsuariosService, private cdr: ChangeDetectorRef) {
    this.getUsuarios();
    this.getSubroles(() => {
      this.getRoles();
    })
  }

  ngOnInit() {
  }


  /* Usuarios */
  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      this.usuariosFiltrados = this.usuarios;
      this.cdr.detectChanges();
      initFlowbite();
    });
  }

  asignarUsuario(usuario: any) {
    this.usuarioEdit = usuario;
  }

  editarUsuario() {
    const data = {
      username: this.usuarioEdit.Username,
      password: this.usuarioEdit.Password
    };
    this.usuariosService.updateDataUsuario(this.usuarioEdit.UsuarioID, data).subscribe(data => {
      this.getUsuarios();
      Swal.fire(
        'Usuario Actualizado',
        'El usuario ha sido actualizado exitosamente.',
        'success'
      )
    });
  }

  filtroTabla() {
    if (this.filtro) {
      this.usuariosFiltrados = this.usuarios.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const cedulaContieneFiltro = elemento.Cedula.toLowerCase().includes(filtroMinuscula);
        const nombreContieneFiltro = elemento.Nombre.toLowerCase().includes(filtroMinuscula);
        return cedulaContieneFiltro || nombreContieneFiltro;
      });
    } else {
      this.usuariosFiltrados = this.usuarios;
    }
    this.cdr.detectChanges();
    initFlowbite();
  }

  actualizarBuk() {
    this.loading = true;
    this.usuariosService.actualizarBuk().subscribe(data => {
      Swal.fire(
        'Actualizado',
        'Los Usuarios se han actualizado correctamente',
        'success'
      )
      this.getUsuarios();
      this.loading = false;
    }, (err => {
      Swal.fire(
        'No Actualizado',
        'No se ha podido realizar la actualización.',
        'error'
      )
      this.loading = false;
    }))
  }


  /* Roles */
  getRoles() {
    this.usuariosService.getRoles().subscribe(data => {
      this.roles = data.map(rol => {
        const subrolesDelRol = this.subroles.filter(subrol => subrol.RolID === rol.RolID);
        return { ...rol, subroles: subrolesDelRol };
      });
    });
  }

  seleccionarRol(rol: any) {
    this.rolSeleccionado = rol;
  }

  crearRol() {
    const data = { nombreRol: this.crearRolNombre, descripcion: this.crearRolDescripcion };
    this.usuariosService.createRol(data).subscribe(data => {
      this.crearRolNombre = '';
      this.crearRolDescripcion = '';
      this.getSubroles(() => {
        this.getRoles();
      })
    });
    this.rolSeleccionado = null;
  }

  eliminarRol(rolID: number) {
    this.usuariosService.deleteRol(rolID).subscribe(data => {
      this.rolSeleccionado = null;
      this.getSubroles(() => {
        this.getRoles();
      })
    })
  }


  /* Sub Roles */
  getSubroles(callback: Function) {
    this.usuariosService.getSubroles().subscribe(data => {
      this.subroles = data;

      callback();
    })
  }

  crearSubrol() {
    const data = { rolID: this.rolSeleccionado.RolID, nombreSubrol: this.crearSubrolNombre, descripcion: this.crearSubrolDescripcion };
    this.usuariosService.createSubrol(data).subscribe(data => {
      this.crearSubrolNombre = '';
      this.crearSubrolDescripcion = '';
      this.getSubroles(() => {
        this.getRoles();
      })
    });
    this.rolSeleccionado = null;
  }

  eliminarSubrol(subrolID: number) {
    this.usuariosService.deleteSubrol(subrolID).subscribe(data => {
      this.rolSeleccionado = null;
      this.getSubroles(() => {
        this.getRoles();
      })
    })
  }

}
