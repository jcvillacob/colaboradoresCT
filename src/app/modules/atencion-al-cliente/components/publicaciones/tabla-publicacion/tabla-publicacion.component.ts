import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClienteExternoService } from '../../../services/cliente-externo.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tabla-publicacion',
  templateUrl: './tabla-publicacion.component.html',
  styleUrls: ['./tabla-publicacion.component.scss']
})
export class TablaPublicacionComponent {
  @Input() datosTabla: any;
  @Input() tipo!: string;
  @Output() eliminar = new EventEmitter<any>();

  constructor(private clienteExternoService: ClienteExternoService) {
  }

  eliminarPublicacion(publicacionID: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se elimirá la publicación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, adelante!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tipo === 'Noticias') {
          this.clienteExternoService.eliminarNoticia(publicacionID).subscribe(data => {
            this.eliminar.emit(data);
          });
        } else {
          this.clienteExternoService.eliminarBlog(publicacionID).subscribe(data => {
            this.eliminar.emit(data);
          });
        }
        Swal.fire(
          'Completado!',
          'Se ha eliminado correctamente.',
          'success'
        );
      } else {

      }
    });

  }

}
