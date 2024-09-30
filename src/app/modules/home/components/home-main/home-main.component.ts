import { Component } from '@angular/core';
import { ClienteExternoService } from 'src/app/modules/atencion-al-cliente/services/cliente-externo.service';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss']
})
export class HomeMainComponent {
  noticia: any = {};
  blogs: any[] = [];
  spinner: boolean = true;

  constructor(private clienteExternoService: ClienteExternoService) {
    this.clienteExternoService.getNoticias().subscribe(data => {
      this.noticia = data.reverse()[0];
      setTimeout(() => {
        this.spinner = false;
      }, 500);
      this.clienteExternoService.getBlogs().subscribe(data => {
        this.blogs = data.reverse();
      })
    });
  }

}
