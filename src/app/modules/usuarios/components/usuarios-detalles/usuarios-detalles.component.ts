import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-usuarios-detalles',
  templateUrl: './usuarios-detalles.component.html',
  styleUrls: ['./usuarios-detalles.component.scss']
})
export class UsuariosDetallesComponent implements OnInit {
  usuario: any = {};
  usuarioID!: number;
  roles: any[] = [];
  rolesAsignados: any[] = [];
  subroles: any[] = [];
  subrolesAsignados: any[] = [];
  listaSubroles = [];

  constructor(private usuariosService: UsuariosService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    const usuarioID = this.route.snapshot.paramMap.get('id');
    if (usuarioID) {
      this.usuarioID = +usuarioID;
      this.getUsuario();
    }
    initFlowbite();
  }

  /* Usuario */
  getUsuario() {
    this.getSubrolesAsignados(() => {
      this.getSubroles();
    })
    this.usuariosService.getUsuario(this.usuarioID).subscribe(data => {
      this.usuario = data;
      this.getRolesAsignados(() => {
        this.getRoles();
      });
    });
  }

  updateStateUsuario() {
    let estado;
    if (this.usuario.Estado) {
      estado = 0;
    } else {
      estado = 1;
    }
    const data = { estado: estado }
    this.usuariosService.updateStateUsuario(this.usuarioID, data).subscribe(data => {
      this.getUsuario();
    })
  }

  eliminarUsuario() {
    this.usuariosService.deleteUsuario(this.usuarioID).subscribe(data => {
      this.router.navigate(['usuarios']);
    })
  }

  /* Roles */
  getRoles() {
    this.usuariosService.getRoles().subscribe(data => {
      this.roles = data.map(rol => {
        const subrolesDelRol = this.subroles.filter(subrol => subrol.RolID === rol.RolID);
        const asignado = this.rolesAsignados.some(rolAsignado => rolAsignado.RolID === rol.RolID);
        return { ...rol, asignado, subroles: subrolesDelRol };
      });
    });
  }

  getRolesAsignados(callback: Function) {
    this.usuariosService.getUsuarioRol(this.usuarioID).subscribe(data => {
      this.rolesAsignados = data;
      // Llama al callback una vez que los roles asignados están listos
      callback();
    });
  }

  asignarRol(rolID: number, event: any) {
    const isChecked = event.target.checked;
    const data = { "usuarioID": this.usuarioID, "rolID": rolID };
    if (isChecked) {
      this.usuariosService.assignRol(data).subscribe(data => {
        this.getUsuario();
      })
    } else {
      this.usuariosService.removeRol(data).subscribe(data => {
        this.getUsuario();
      })
    }
  }


  /* Sub Roles */
  getSubroles() {
    this.usuariosService.getSubroles().subscribe(data => {
      this.subroles = data.map(subrol => {
        const asignado = this.subrolesAsignados.some(subrolAsignado => subrolAsignado.SubrolID === subrol.SubrolID);
        return { ...subrol, asignado };
      });
    })
  }

  getSubrolesAsignados(callback: Function) {
    this.usuariosService.getUsuarioSubrol(this.usuarioID).subscribe(data => {
      this.subrolesAsignados = data;
      // Llama al callback una vez que los roles asignados están listos
      callback();
    })
  }

  asignarSubrol(subrolID: number, event: any) {
    const isChecked = event.target.checked;
    const data = { "usuarioID": this.usuarioID, "subrolID": subrolID };
    if (isChecked) {
      this.usuariosService.assignSubrol(data).subscribe(data => {
        this.getUsuario();
      })
    } else {
      this.usuariosService.removeSubrol(data).subscribe(data => {
        this.getUsuario();
      })
    }
  }

  goBack() {
    window.history.back();
  }
}
