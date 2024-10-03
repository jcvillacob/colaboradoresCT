import { createAction, props } from '@ngrx/store';

export const loadBlogs = createAction('[Blogs] Cargar Blogs');

// Acción que se dispara cuando se han cargado los blogs exitosamente
export const loadBlogsSuccess = createAction(
  '[Blogs] Cargar Blogs Exito',
  props<{ blogs: any[] }>()
);

// Acción que se dispara si hay un error al cargar los blogs
export const loadBlogsFailure = createAction(
  '[Blogs] Cargar Blogs Error',
  props<{ error: any }>()
);

// Acción para obtener un blog específico
export const loadBlog = createAction(
  '[Blog] Cargar Blog',
  props<{ id: number }>()
);

// Acción que se dispara cuando se ha cargado el blog específico exitosamente
export const loadBlogSuccess = createAction(
  '[Blog] Cargar Blog Exito',
  props<{ blog: any }>()
);

// Acción que se dispara si hay un error al cargar el blog específico
export const loadBlogFailure = createAction(
  '[Blog] Cargar Blog Error',
  props<{ error: any }>()
);

// Acción para crear un blog nuevo
export const createBlog = createAction(
  '[Blog] Crear Blog',
  props<{ blogData: any }>()
);

// Acción que se dispara cuando el blog se ha creado exitosamente
export const createBlogSuccess = createAction(
  '[Blog] Crear Blog Exito',
  props<{ blog: any }>()
);

// Acción que se dispara si hay un error al crear el blog
export const createBlogFailure = createAction(
  '[Blog] Crear Blog Error',
  props<{ error: any }>()
);

// Acción para actualizar un blog
export const updateBlog = createAction(
  '[Blog] Actualizar Blog',
  props<{ blogDataID: number, blogData: any }>()
);

// Acción que se dispara cuando el blog se ha actualizado exitosamente
export const updateBlogSuccess = createAction(
  '[Blog] Actualizar Blog Exito',
  props<{ blog: any }>()
);

// Acción que se dispara si hay un error al actualizar el blog
export const updateBlogFailure = createAction(
  '[Blog] Actualizar Blog Error',
  props<{ error: any }>()
);

// Acción para eliminar un blog
export const deleteBlog = createAction(
  '[Blog] Eliminar Blog',
  props<{ blogDataID: number }>()
);

// Acción que se dispara cuando el blog se ha eliminado exitosamente
export const deleteBlogSuccess = createAction(
  '[Blog] Eliminar Blog Exito',
  props<{ blogDataID: number }>()
);

// Acción que se dispara si hay un error al eliminar el blog
export const deleteBlogFailure = createAction(
  '[Blog] Eliminar Blog Error',
  props<{ error: any }>()
);

// Acción para eliminar Imágenes Temporales
export const deleteTemporaryImages = createAction(
  '[Blog] Eliminar Imagenes Temporales',
  props<{ imageUrls: string[] }>()
);

// Acción que se dispara cuando el blog se ha eliminado exitosamente
export const deleteTemporaryImagesSuccess = createAction(
  '[Blog] Eliminar Imagenes Temporales Exito',
  props<{ message: any }>()
);

// Acción que se dispara si hay un error al eliminar el blog
export const deleteTemporaryImagesFailure = createAction(
  '[Blog] Eliminar Imagenes Temporales Error',
  props<{ error: any }>()
);
