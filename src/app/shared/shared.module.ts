import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent }      from './navbar/navbar.component';
import { ProductCardComponent } from './product-card/product-card.component';

// SharedModule agrupa componentes reutilizables que se usan en varios módulos.
// Al exportarlos, quedan disponibles para cualquier módulo que importe SharedModule.
@NgModule({
  declarations: [
    NavbarComponent,
    ProductCardComponent   // Componente reutilizable de tarjeta de producto
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,          // Exportamos CommonModule para que CurrencyPipe y ngIf/ngFor
                           // funcionen en los componentes que usen SharedModule
    NavbarComponent,
    ProductCardComponent   // Lo exportamos para que Dashboard y otros lo puedan usar
  ]
})
export class SharedModule { }
