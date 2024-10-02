import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BlogsService } from '../services/blogs.service';
import * as BlogsActions from './blogs.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class BlogsEffects {
  constructor(
    private actions$: Actions,
    private blogsService: BlogsService
  ) {}

  // Efecto para cargar todos los blogs
  cargarBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogsActions.loadBlogs),
      mergeMap(() =>
        this.blogsService.getBlogs().pipe(
          map(blogs => BlogsActions.loadBlogsSuccess({ blogs })),
          catchError(error => of(BlogsActions.loadBlogsFailure({ error })))
        )
      )
    )
  );

  // Efecto para cargar un blog específico
  cargarBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogsActions.loadBlog),
      mergeMap(action =>
        this.blogsService.getBlog(action.id).pipe(
          map(blog => BlogsActions.loadBlogSuccess({ blog })),
          catchError(error => of(BlogsActions.loadBlogFailure({ error })))
        )
      )
    )
  );

  // Efecto para crear un nuevo blog
  crearBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogsActions.createBlog),
      mergeMap(action =>
        this.blogsService.createBlog(action.blogData).pipe(
          map(blog => BlogsActions.createBlogSuccess({ blog })),
          catchError(error => of(BlogsActions.createBlogFailure({ error })))
        )
      )
    )
  );

  // Efecto para actualizar un blog
  actualizarBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogsActions.updateBlog),
      mergeMap(action =>
        this.blogsService.updateBlog(action.blogDataID, action.blogData).pipe(
          map(blog => BlogsActions.updateBlogSuccess({ blog })),
          catchError(error => of(BlogsActions.updateBlogFailure({ error })))
        )
      )
    )
  );

  // Efecto para eliminar un blog
  eliminarBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogsActions.deleteBlog),
      mergeMap(action =>
        this.blogsService.deleteBlog(action.blogDataID).pipe(
          map(() => BlogsActions.deleteBlogSuccess({ blogDataID: action.blogDataID })),
          catchError(error => of(BlogsActions.deleteBlogFailure({ error })))
        )
      )
    )
  );
}
