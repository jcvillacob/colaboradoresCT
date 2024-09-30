import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConductorRoutingModule } from './conductor-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubirArchivosComponent } from './components/subir-archivos/subir-archivos.component';
import { AbcComponent } from './components/abc/abc.component';
import { AbcVideosComponent } from './components/abc-videos/abc-videos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArchivosSubidosComponent } from './components/archivos-subidos/archivos-subidos.component';
import { AbcPdfComponent } from './components/abc-pdf/abc-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NovedadComponent } from './components/novedad/novedad.component';


@NgModule({
  declarations: [
    SubirArchivosComponent,
    AbcComponent,
    AbcVideosComponent,
    AbcPdfComponent,
    ArchivosSubidosComponent,
    NovedadComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ConductorRoutingModule,
    SharedModule,
    FormsModule,
    PdfViewerModule
  ]
})
export class ConductorModule { }
