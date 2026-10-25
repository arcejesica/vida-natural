import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Datos que el componente padre (ProductoDetalleComponent) le pasa al diálogo
export interface ConfirmarCompraData {
  nombreProducto:  string;
  cantidad:        number;
  precioUnitario:  number;
  total:           number;  // precioUnitario * cantidad (calculado en el padre)
}

// ConfirmarCompraComponent — Diálogo de confirmación de compra con Angular Material.
//
// El padre lo abre con:
//   const dialogRef = this.dialog.open(ConfirmarCompraComponent, {
//     width: '420px',
//     data: { nombreProducto, cantidad, precioUnitario, total }
//   });
//
// El resultado se obtiene con:
//   dialogRef.afterClosed().subscribe((confirmado: boolean) => {
//     if (confirmado) { /* procesar compra */ }
//   });

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.css']
})
export class ConfirmarCompraComponent {

  constructor(
    // MatDialogRef: permite cerrar el diálogo desde este componente
    public dialogRef: MatDialogRef<ConfirmarCompraComponent>,
    // MAT_DIALOG_DATA: los datos que pasó el padre al abrir el diálogo
    @Inject(MAT_DIALOG_DATA) public data: ConfirmarCompraData
  ) {}

  // Cierra el diálogo y devuelve FALSE → el padre NO procesa la compra
  cancelar(): void {
    this.dialogRef.close(false);
  }

  // Cierra el diálogo y devuelve TRUE → el padre procesa la compra
  confirmar(): void {
    this.dialogRef.close(true);
  }
}
