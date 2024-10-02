import { Component, OnInit } from '@angular/core';
import { ClienteExternoService } from '../../services/cliente-externo.service';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as BlogsActions from '../../store/blogs.actions';
import * as fromBlogs from '../../store/blogs.reducer';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blog!: Observable<any>;
  spinner: boolean = true;

  constructor (private clienteExternoService: ClienteExternoService, private route: ActivatedRoute, private store: Store<{ blogs: fromBlogs.BlogsState }>) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.store.dispatch(BlogsActions.loadBlog({ id }));
      } else {
        console.error('Blog ID is required');
      }
      this.blog = this.store.pipe(select((state) => state.blogs.blog));

      // Oculta el spinner cuando el blog es emitido
      this.blog.subscribe({
        next: (blogData) => {
          if (blogData) {
            setTimeout(() => {
              this.spinner = false;
            }, 1000)
          }
        },
        error: (err) => console.error('Error loading blog data', err)
      });
    });
  }
}
