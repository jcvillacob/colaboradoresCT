import { Component } from '@angular/core';
import { ClienteExternoService } from '../../services/cliente-externo.service';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as BlogsActions from '../../store/blogs.actions';
import * as fromBlogs from '../../store/blogs.reducer';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss']
})
export class PublicacionesComponent {
  blogs$: Observable<any[]> = new Observable();
  noticias: any[] = [];

  constructor(private clienteExternoService: ClienteExternoService, private store: Store<{ blogs: fromBlogs.BlogsState }>) {
    this.getDatos();
  }

  getDatos() {
    this.store.dispatch(BlogsActions.loadBlogs());
    this.blogs$ = this.store.pipe(select((state) => state.blogs.blogs));

    this.clienteExternoService.getNoticias().subscribe(data => {
      this.noticias = data.reverse();
    })
  }

  eliminar() {
    this.clienteExternoService.getNoticias().subscribe(data => {
      this.getDatos();
    });
  }

}
