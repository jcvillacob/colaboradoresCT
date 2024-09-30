import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { AtencionAlClienteHomeComponent } from './components/atencion-al-cliente-home/atencion-al-cliente-home.component';
import { SubirPublicacionComponent } from './components/subir-publicacion/subir-publicacion.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { SubirNoticiasComponent } from './components/subir-noticias/subir-noticias.component';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { PqrsIndividualComponent } from './components/pqrs/pqrs-individual/pqrs-individual.component';

const routes: Routes = [
  { path: '', component: AtencionAlClienteHomeComponent },
  { path: 'publicaciones', component: PublicacionesComponent },
  { path: 'PQRS', component: PqrsComponent },
  { path: 'pqrs-individual/:id', component: PqrsIndividualComponent },
  { path: 'subir-blog', component: SubirPublicacionComponent },
  { path: 'subir-noticia', component: SubirNoticiasComponent },
  { path: 'blogs/:id', component: BlogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtencionAlClienteRoutingModule { }
