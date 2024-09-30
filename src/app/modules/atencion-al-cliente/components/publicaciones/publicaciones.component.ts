import { Component } from '@angular/core';
import { ClienteExternoService } from '../../services/cliente-externo.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss']
})
export class PublicacionesComponent {
  blogs: any[] = [];
  noticias: any[] = [];

  constructor(private clienteExternoService: ClienteExternoService) {
    this.getDatos();
  }

  getDatos() {
    this.clienteExternoService.getNoticias().subscribe(data => {
      this.noticias = data.reverse();
      this.clienteExternoService.getBlogs().subscribe(data => {
        this.blogs = data.reverse();
      })
    });
  }

  eliminar() {
    this.clienteExternoService.getNoticias().subscribe(data => {
      this.getDatos();
    });
  }

}
