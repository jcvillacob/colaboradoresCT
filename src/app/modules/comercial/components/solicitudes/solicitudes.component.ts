import { Component } from '@angular/core';
import { ComercialService } from '../../services/comercial.service';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent {
  solicitudes: any[] = [];
  solicitudesSelected: any[] = [];
  filtro!: string;

  constructor(private comercialService: ComercialService) {
    this.getSolicitudes();
  }

  getSolicitudes() {
    this.comercialService.getSolicitudes().subscribe(data => {
      this.solicitudes = data.reverse();
      this.solicitudesSelected = this.solicitudes;
      this.filtro = '';
      setTimeout(() => {
        initFlowbite();
      }, 200);
    })
  }

  filtroSolicitudes() {
    if (this.filtro) {
      this.solicitudesSelected = this.solicitudes.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const empresaContieneFiltro = elemento.Empresa.toLowerCase().includes(filtroMinuscula);
        const origenContieneFiltro = elemento.Origen.toLowerCase().includes(filtroMinuscula);
        const NITContieneFiltro = elemento.NIT.toLowerCase().includes(filtroMinuscula);
        const destinoContieneFiltro = elemento.Destino.toLowerCase().includes(filtroMinuscula);
        return empresaContieneFiltro || origenContieneFiltro || destinoContieneFiltro || NITContieneFiltro;
      });
    } else {
      this.solicitudesSelected = this.solicitudes;
      initFlowbite();
    }

  }

  eliminarSolicitudes(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará la solicitud',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comercialService.deleteSolicitudes(id).subscribe(data => {
          this.getSolicitudes();
          Swal.fire(
            'Solicitud Eliminada',
            'La solicitud ha sido eliminada exitosamente.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            'Solicitud NO Eliminada',
            'La solicitud no ha podido ser eliminada.',
            'warning'
          )
        });
      };
    });
  }

}
