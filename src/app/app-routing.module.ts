import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/login/login.component';
import { AuthGuard } from './core/authentication/auth.guard';
import { loginGuard } from './core/authentication/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'comercial',
    loadChildren: () => import('./modules/comercial/comercial.module').then(m => m.ComercialModule),
    canActivate: [AuthGuard],
    data: { roles: ['Comercial'] }
  },
  {
    path: 'financiera',
    loadChildren: () => import('./modules/financiera/financiera.module').then(m => m.FinancieraModule),
    canActivate: [AuthGuard],
    data: { roles: ['Financiera'] }
  },
  {
    path: 'atencion-al-cliente',
    loadChildren: () => import('./modules/atencion-al-cliente/atencion-al-cliente.module').then(m => m.AtencionAlClienteModule),
    canActivate: [AuthGuard],
    data: { roles: ['Cliente Externo'] }
  },
  {
    path: 'innovacion',
    loadChildren: () => import('./modules/innovacion/innovacion.module').then(m => m.InnovacionModule),
    canActivate: [AuthGuard],
    data: { roles: ['Innovacion'] }
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./modules/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule),
    canActivate: [AuthGuard],
    data: { roles: ['Mantenimiento'] }
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard],
    data: { roles: ['Usuarios'] }
  },
  {
    path: 'condutores',
    loadChildren: () => import('./modules/conductor/conductor.module').then(m => m.ConductorModule),
    canActivate: [AuthGuard],
    data: { roles: ['Conductor'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
