import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material — usados activamente en este módulo
import { MatSnackBarModule }  from '@angular/material/snack-bar';
import { MatTooltipModule }   from '@angular/material/tooltip';
import { MatDialogModule }    from '@angular/material/dialog';
import { MatButtonModule }    from '@angular/material/button';

// Módulo compartido (ProductCardComponent, NavbarComponent, CommonModule)
import { SharedModule } from '../../shared/shared.module';

// Routing interno del módulo de productos (Lazy Loading)
import { ProductosRoutingModule } from './productos-routing.module';

// Páginas del módulo
import { ProductosListaComponent }    from './productos-lista/productos-lista.component';
import { ProductoDetalleComponent }   from './producto-detalle/producto-detalle.component';
import { ProductoNuevoComponent }     from './producto-nuevo/producto-nuevo.component';
import { ProductoEditarComponent }    from './producto-editar/producto-editar.component';

// Diálogos de confirmación (Angular Material Dialog)
import { ConfirmarEliminarComponent } from './confirmar-eliminar/confirmar-eliminar.component';
import { ConfirmarCompraComponent }   from './confirmar-compra/confirmar-compra.component';

// ProductosModule se carga con Lazy Loading.
// Angular solo descarga este bundle cuando el usuario navega a /productos.
@NgModule({
  declarations: [
    ProductosListaComponent,
    ProductoDetalleComponent,
    ProductoNuevoComponent,
    ProductoEditarComponent,
    ConfirmarEliminarComponent,  // Diálogo confirmar eliminación
    ConfirmarCompraComponent     // Diálogo confirmar compra
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductosRoutingModule,
    SharedModule,              // Trae CommonModule, ProductCard, etc.
    // Angular Material
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ProductosModule { }
