import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';

import { ProductosListaComponent }  from './productos-lista/productos-lista.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { ProductoNuevoComponent }   from './producto-nuevo/producto-nuevo.component';
import { ProductoEditarComponent }  from './producto-editar/producto-editar.component';

// IMPORTANTE: el orden de las rutas es fundamental en Angular Router.
// Las rutas más específicas (como 'nuevo') deben ir ANTES que los parámetros dinámicos (':id'),
// de lo contrario 'nuevo' sería interpretado como un id numérico.
const routes: Routes = [

  // Lista: accesible para todos los usuarios logueados
  { path: '', component: ProductosListaComponent },

  // Nuevo producto: va ANTES que :id para evitar conflicto de rutas
  // Solo accesible para admin (RoleGuard)
  {
    path: 'nuevo',
    component: ProductoNuevoComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Editar producto: también ANTES que :id solo (aunque :id/editar no colisiona)
  // Solo accesible para admin (RoleGuard)
  {
    path: ':id/editar',
    component: ProductoEditarComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Detalle: accesible para admin y usuario
  // Va DESPUÉS de 'nuevo' para que Angular no lo capture primero
  { path: ':id', component: ProductoDetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
