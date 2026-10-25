import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { CompraService } from '../../../services/compra.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';
import { ConfirmarEliminarComponent } from '../confirmar-eliminar/confirmar-eliminar.component';
import { ConfirmarCompraComponent }   from '../confirmar-compra/confirmar-compra.component';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {

  producto: Product | undefined;
  cargando  = true;
  error     = '';

  // ── Compra (rol usuario) ─────────────────────────────────
  cantidadCompra = 1;    // Cantidad seleccionada por el usuario
  comprando      = false; // Spinner mientras se procesa
  errorCompra    = '';

  // ── Agregar stock (rol admin) ────────────────────────────
  cantidadStock  = 1;    // Cantidad a reponer
  agregandoStock = false;

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private productService: ProductService,
    private compraService:  CompraService,
    private authService:    AuthService,
    private dialog:         MatDialog,
    private snackBar:       MatSnackBar
  ) {}

  get esAdmin(): boolean {
    return this.authService.esAdmin();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (isNaN(id)) {
      this.error    = 'ID de producto inválido.';
      this.cargando = false;
      return;
    }

    this.cargarProducto(id);
  }

  cargarProducto(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (producto) => {
        this.cargando = false;
        if (!producto) {
          this.error = 'El producto no fue encontrado.';
          return;
        }
        this.producto = producto;
      },
      error: () => {
        this.cargando = false;
        this.error    = 'Error al cargar el producto.';
      }
    });
  }

  // ── onComprar() ──────────────────────────────────────────────────────────
  // Flujo:
  //   1. Valida la cantidad (mínimo 1, máximo = stock disponible)
  //   2. Abre MatDialog con el resumen: producto, cantidad, precio, total
  //   3. Si el usuario confirma:
  //      a. productService.comprarProducto() → GET + validación + PUT en MockAPI
  //      b. compraService.registrarCompra() → POST /compras en MockAPI
  //      c. Actualiza la vista con el nuevo stock
  //   4. Si cancela: no hace nada
  onComprar(): void {
    if (!this.producto) return;

    // Validación antes de abrir el diálogo
    if (this.cantidadCompra < 1) {
      this.errorCompra = 'La cantidad mínima es 1.';
      return;
    }
    if (this.cantidadCompra > this.producto.stock) {
      this.errorCompra = `Solo hay ${this.producto.stock} unidades disponibles.`;
      return;
    }

    this.errorCompra = '';

    // Abrimos el diálogo de confirmación con el resumen de la compra
    const dialogRef = this.dialog.open(ConfirmarCompraComponent, {
      width: '420px',
      maxWidth: '95vw',   // En mobile no desborda la pantalla
      data: {
        nombreProducto: this.producto.nombre,
        cantidad:       this.cantidadCompra,
        precioUnitario: this.producto.precio,
        total:          this.producto.precio * this.cantidadCompra
      }
    });

    // afterClosed() emite true si confirmó, false si canceló
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado || !this.producto) return; // Usuario canceló

      this.comprando = true;

      // Paso 1: actualiza el stock en MockAPI
      this.productService.comprarProducto(this.producto.id, this.cantidadCompra).subscribe({
        next: (productoActualizado) => {
          const usuario = this.authService.usuarioActualValor;

          // Paso 2: registra la compra en MockAPI /compras
          this.compraService.registrarCompra({
            usuarioEmail:   usuario?.email   || '',
            usuarioNombre:  usuario?.nombre  || '',
            productoId:     productoActualizado.id,
            productoNombre: productoActualizado.nombre,
            cantidad:       this.cantidadCompra,
            precioUnitario: productoActualizado.precio,
            total:          productoActualizado.precio * this.cantidadCompra,
            fecha:          new Date().toISOString()
          }).subscribe({
            next: () => {
              this.producto       = productoActualizado;
              this.cantidadCompra = 1;
              this.comprando      = false;
              this.snackBar.open('¡Compra realizada correctamente!', 'Cerrar', { duration: 3500 });
            },
            error: () => {
              this.producto  = productoActualizado;
              this.comprando = false;
              this.snackBar.open('Compra realizada, pero no se pudo registrar.', 'Cerrar', { duration: 3500 });
            }
          });
        },
        error: (err: Error) => {
          this.comprando   = false;
          this.errorCompra = err.message;
        }
      });
    });
  }

  // ── onAgregarStock() ─────────────────────────────────────────────────────
  // Solo para admin. Suma unidades al stock actual.
  onAgregarStock(): void {
    if (!this.producto || this.cantidadStock < 1) return;

    this.agregandoStock = true;

    this.productService.agregarStock(this.producto.id, this.cantidadStock).subscribe({
      next: (productoActualizado) => {
        this.producto       = productoActualizado;  // Actualiza la vista
        this.cantidadStock  = 1;
        this.agregandoStock = false;

        this.snackBar.open('Stock actualizado correctamente.', 'Cerrar', { duration: 3000 });
      },
      error: (err: Error) => {
        this.agregandoStock = false;
        this.snackBar.open(err.message || 'Error al actualizar el stock.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  editar(): void {
    if (this.producto) {
      this.router.navigate(['/productos', this.producto.id, 'editar']);
    }
  }

  eliminar(): void {
    if (!this.producto) return;

    const dialogRef = this.dialog.open(ConfirmarEliminarComponent, {
      width: '400px',
      data: { nombreProducto: this.producto.nombre }
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado || !this.producto) return;

      this.productService.deleteProduct(this.producto.id).subscribe({
        next: () => {
          this.snackBar.open(`"${this.producto!.nombre}" eliminado correctamente.`, 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/productos']);
        },
        error: () => {
          this.snackBar.open('Error al eliminar el producto.', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }
}
