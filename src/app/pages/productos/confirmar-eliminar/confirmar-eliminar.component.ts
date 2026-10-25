import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Datos que el componente padre le pasa al diálogo
export interface ConfirmarEliminarData {
  nombreProducto: string;
}

// ConfirmarEliminarComponent — Diálogo de confirmación usando Angular Material Dialog.
//
// El padre lo abre con:
//   const dialogRef = this.dialog.open(ConfirmarEliminarComponent, {
//     data: { nombreProducto: 'Aceite de coco' }
//   });
//
// El resultado se obtiene con:
//   dialogRef.afterClosed().subscribe(confirmado => {
//     if (confirmado) { /* eliminar */ }
//   });

@Component({
  selector: 'app-confirmar-eliminar',
  templateUrl: './confirmar-eliminar.component.html',
  styleUrls: ['./confirmar-eliminar.component.css']
})
export class ConfirmarEliminarComponent {

  constructor(
    // MatDialogRef: permite cerrar el diálogo desde este componente
    public dialogRef: MatDialogRef<ConfirmarEliminarComponent>,
    // MAT_DIALOG_DATA: los datos que pasó el padre al abrir el diálogo
    @Inject(MAT_DIALOG_DATA) public data: ConfirmarEliminarData
  ) {}

  // Cierra el diálogo y devuelve FALSE al padre (usuario canceló)
  cancelar(): void {
    this.dialogRef.close(false);
  }

  // Cierra el diálogo y devuelve TRUE al padre (usuario confirmó)
  confirmar(): void {
    this.dialogRef.close(true);
  }
}
