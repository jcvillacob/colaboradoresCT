import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';




import { AtencionAlClienteRoutingModule } from './atencion-al-cliente-routing.module';
import { AtencionaAlClienteMainComponent } from './components/atenciona-al-cliente-main/atenciona-al-cliente-main.component';
import { AgregarPublicacionComponent } from './components/publicaciones/agregar-publicacion/agregar-publicacion.component';
import { TablaPublicacionComponent } from './components/publicaciones/tabla-publicacion/tabla-publicacion.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { AtencionAlClienteHomeComponent } from './components/atencion-al-cliente-home/atencion-al-cliente-home.component';
import { SubirPublicacionComponent } from './components/subir-publicacion/subir-publicacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogsComponent } from './components/blogs/blogs.component';
import { SubirNoticiasComponent } from './components/subir-noticias/subir-noticias.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { PqrsIndividualComponent } from './components/pqrs/pqrs-individual/pqrs-individual.component';


@NgModule({
  declarations: [
    AtencionaAlClienteMainComponent,
    AgregarPublicacionComponent,
    TablaPublicacionComponent,
    PublicacionesComponent,
    AtencionAlClienteHomeComponent,
    SubirPublicacionComponent,
    BlogsComponent,
    SubirNoticiasComponent,
    PqrsComponent,
    PqrsIndividualComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AtencionAlClienteRoutingModule,
    FormsModule,
    CKEditorModule,
    SharedModule
  ]
})
export class AtencionAlClienteModule { }
