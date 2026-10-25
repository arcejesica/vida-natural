import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';
import { ConfirmarEliminarComponent } from '../confirmar-eliminar/confirmar-eliminar.component';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit, OnDestroy {

  // Lista original del servicio (no se modifica al filtrar)
  productos: Product[] = [];

  // Lista que se muestra en la tabla (resultado del filtrado)
  productosFiltrados: Product[] = [];

  cargando = false;
  error    = '';

  // Valores actuales del buscador y filtro de categoría
  terminoBusqueda   = '';
  categoriaFiltrada = '';

  // Categorías disponibles para el select
  categorias: string[] = [];

  // Subject para el buscador reactivo con RxJS
  // debounceTime evita hacer filtrado en cada tecla
  private busquedaSubject = new Subject<string>();

  // Subject para limpiar suscripciones cuando el componente se destruye
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private authService:    AuthService,
    private router:         Router,
    private dialog:         MatDialog,    // Angular Material Dialog
    private snackBar:       MatSnackBar   // Angular Material Snackbar
  ) {}

  get esAdmin(): boolean {
    return this.authService.esAdmin();
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.configurarBuscadorReactivo();
  }

  // Configura el buscador con operadores RxJS:
  // debounceTime: espera 300ms después de la última tecla antes de filtrar
  // distinctUntilChanged: no filtra si el valor no cambió
  // takeUntil: cancela la suscripción cuando el componente se destruye
  private configurarBuscadorReactivo(): void {
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.aplicarFiltros();
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error    = '';

    this.productService.getProducts().subscribe({
      next: (productos) => {
        this.productos          = productos;
        this.productosFiltrados = [...productos];

        // Extraemos categorías únicas directamente de los productos cargados
        // Esto funciona tanto en modo local como cuando la API está conectada
        const cats = productos.map(p => p.categoria);
        this.categorias = [...new Set(cats)].sort();

        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error    = 'No se pudieron cargar los productos.';
      }
    });
  }

  // Se llama cuando el usuario escribe en el buscador
  onBuscar(): void {
    this.busquedaSubject.next(this.terminoBusqueda);
  }

  // Se llama cuando el usuario cambia el filtro de categoría
  onFiltrarCategoria(): void {
    this.aplicarFiltros();
  }

  // Aplica buscador + filtro de categoría en simultáneo
  private aplicarFiltros(): void {
    let resultado = [...this.productos];

    // Filtro por nombre (buscador)
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.marca.toLowerCase().includes(termino)
      );
    }

    // Filtro por categoría
    if (this.categoriaFiltrada) {
      resultado = resultado.filter(p => p.categoria === this.categoriaFiltrada);
    }

    this.productosFiltrados = resultado;
  }

  limpiarFiltros(): void {
    this.terminoBusqueda   = '';
    this.categoriaFiltrada = '';
    this.productosFiltrados = [...this.productos];
  }

  verDetalle(id: number): void {
    this.router.navigate(['/productos', id]);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/productos', id, 'editar']);
  }

  // Eliminar con confirmación mediante MatDialog
  eliminarProducto(producto: Product): void {
    // Abrimos el diálogo de confirmación de Angular Material
    const dialogRef = this.dialog.open(ConfirmarEliminarComponent, {
      width: '400px',
      data: { nombreProducto: producto.nombre }
    });

    // Esperamos el resultado: true = confirmar, false = cancelar
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (!confirmado) return;

      this.productService.deleteProduct(producto.id).subscribe({
        next: () => {
          // Quitamos el producto de la lista local sin recargar todo
          this.productos = this.productos.filter(p => p.id !== producto.id);
          this.aplicarFiltros();

          this.snackBar.open(`"${producto.nombre}" eliminado correctamente.`, 'Cerrar', {
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.open('Error al eliminar el producto.', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Completamos el Subject para liberar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }
}
