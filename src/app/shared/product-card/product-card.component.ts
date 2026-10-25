import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';

// ProductCardComponent es un componente reutilizable para mostrar una tarjeta de producto.
//
// Comunicación entre componentes:
//   @Input  → el componente PADRE le pasa el producto a mostrar
//   @Output → el componente hijo notifica al padre cuando el usuario hace clic en "Ver más"
//
// Uso:
//   <app-product-card [producto]="unProducto" (verMas)="onVerMas($event)"></app-product-card>

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  // @Input: propiedad que el componente padre le envía al hijo (Property Binding)
  @Input() producto!: Product;

  // @Output: evento que el hijo emite hacia el padre cuando se hace clic en "Ver más"
  // El padre puede reaccionar con (verMas)="miFuncion($event)"
  @Output() verMas = new EventEmitter<Product>();

  // Cuando el usuario hace clic en "Ver más", emitimos el producto hacia el padre
  onVerMas(): void {
    this.verMas.emit(this.producto);
  }
}
