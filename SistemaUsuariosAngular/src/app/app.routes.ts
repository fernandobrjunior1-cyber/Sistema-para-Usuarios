import { TabelaUsuarios } from './components/tabela-usuarios/tabela-usuarios';
import { Routes } from '@angular/router';
import { FormularioReativo } from './components/formulario-reativo/formulario-reativo';

import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Admin } from './components/admin/admin';
import { Usuario } from './components/usuario/usuario';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

{
  path: 'tabela-usuarios',
  component: TabelaUsuarios
},


  {
  path: 'formulario-reativo',
  component: FormularioReativo
},

  {
    path: 'login',
    component: Login
  },

  {
    path: 'cadastro',
    component: Cadastro
  },

  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard]
  },

  {
    path: 'usuario',
    component: Usuario,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
