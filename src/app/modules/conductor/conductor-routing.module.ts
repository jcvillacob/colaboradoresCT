import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConductorHomeComponent } from './components/conductor-home/conductor-home.component';
import { AbcComponent } from './components/abc/abc.component';
import { SubirArchivosComponent } from './components/subir-archivos/subir-archivos.component';
import { AbcPdfComponent } from './components/abc-pdf/abc-pdf.component';
import { AbcVideosComponent } from './components/abc-videos/abc-videos.component';
import { ArchivosSubidosComponent } from './components/archivos-subidos/archivos-subidos.component';
import { NovedadComponent } from './components/novedad/novedad.component';
import { AuthGuard } from 'src/app/core/authentication/auth.guard';

const routes: Routes = [
  { path: '', component: ConductorHomeComponent },
  { path: 'abc', component: AbcComponent },
  { path: 'abc/video/:id', component: AbcVideosComponent },
  { path: 'abc/pdf/:id', component: AbcPdfComponent },
  { path: 'subir', component: SubirArchivosComponent, canActivate: [AuthGuard], data: { subroles: ['Subir Archivos'] } },
  { path: 'archivos', component: ArchivosSubidosComponent, canActivate: [AuthGuard], data: { subroles: ['Subir Archivos'] } },
  { path: 'novedades', component: NovedadComponent, canActivate: [AuthGuard], data: { subroles: ['Subir Novedad'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConductorRoutingModule { }
