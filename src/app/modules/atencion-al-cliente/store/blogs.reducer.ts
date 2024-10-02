import { createReducer, on } from '@ngrx/store';
import * as BlogsActions from './blogs.actions';

export interface BlogsState {
  blogs: any[];
  blog: any | null;
  loading: boolean;
  error: any | null;
}

export const initialState: BlogsState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
};

export const blogsReducer = createReducer(
  initialState,
  // Cargar todos los blogs
  on(BlogsActions.loadBlogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BlogsActions.loadBlogsSuccess, (state, { blogs }) => ({
    ...state,
    loading: false,
    blogs,
  })),
  on(BlogsActions.loadBlogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Cargar un blog específico
  on(BlogsActions.loadBlog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BlogsActions.loadBlogSuccess, (state, { blog }) => ({
    ...state,
    loading: false,
    blog,
  })),
  on(BlogsActions.loadBlogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Crear un nuevo blog
  on(BlogsActions.createBlog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BlogsActions.createBlogSuccess, (state, { blog }) => ({
    ...state,
    loading: false,
    blogs: [...state.blogs, blog],
  })),
  on(BlogsActions.createBlogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Actualizar un blog
  on(BlogsActions.updateBlog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BlogsActions.updateBlogSuccess, (state, { blog }) => ({
    ...state,
    loading: false,
    blogs: state.blogs.map(b => b.id === blog.id ? blog : b),
  })),
  on(BlogsActions.updateBlogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Eliminar un blog
  on(BlogsActions.deleteBlog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BlogsActions.deleteBlogSuccess, (state, { blogDataID }) => ({
    ...state,
    loading: false,
    blogs: state.blogs.filter(b => b.id !== blogDataID),
  })),
  on(BlogsActions.deleteBlogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
