import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Datos del usuario logueado (Interpolación en el template)
  usuarioActual: User | null = null;

  // Lista completa de productos (obtenida desde el servicio)
  productos: Product[] = [];

  // Estado de carga (*ngIf en el template)
  cargando = true;

  // ── Estadísticas ──────────────────────────────────────────────────────────────
  totalProductos       = 0;   // Tarjeta 1: total de productos
  productosDisponibles = 0;   // Tarjeta 2: disponibles con stock > 0
  productosSinStock    = 0;   // Tarjeta 3: productos sin stock (stock === 0)
  productosStockBajo   = 0;   // Tarjeta 4: stock > 0 y stock <= 10 (stock bajo)

  constructor(
    private productService: ProductService,  // Inyección de dependencia del servicio
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenemos el usuario logueado directamente (sin suscripción)
    this.usuarioActual = this.authService.usuarioActualValor;

    // Cargamos los productos desde el servicio
    this.cargarProductos();
  }

  // El componente obtiene los productos del servicio
  cargarProductos(): void {
    this.cargando = true;

    // Nos suscribimos al Observable que retorna el servicio
    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.calcularEstadisticas(productos);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  private calcularEstadisticas(productos: Product[]): void {
    this.totalProductos = productos.length;

    // Disponibles: disponible === true Y stock mayor a 0
    this.productosDisponibles = productos.filter(
      p => p.disponible && p.stock > 0
    ).length;

    // Sin stock: stock === 0
    this.productosSinStock = productos.filter(
      p => p.stock === 0
    ).length;

    // Stock bajo: tienen algo de stock pero es escaso (≤10 unidades)
    this.productosStockBajo = productos.filter(
      p => p.stock > 0 && p.stock <= 10
    ).length;
  }

  // Getter: retorna los primeros 3 productos para mostrar como "Productos destacados"
  // El padre (Dashboard) se los pasa al hijo (ProductCard) mediante @Input
  get productosDestacados(): Product[] {
    return this.productos.slice(0, 3);
  }

  // Handler del @Output del ProductCardComponent.
  // Cuando el usuario hace clic en "Ver más" en una card, navegamos al detalle.
  onVerMas(producto: Product): void {
    this.router.navigate(['/productos', producto.id]);
  }
}
