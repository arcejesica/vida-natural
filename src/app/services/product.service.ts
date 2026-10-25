import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

// =============================================
// ProductService — Servicio central de productos.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  INSTRUCCIONES PARA CONECTAR MockAPI                            │
// │                                                                 │
// │  1. Ir a https://mockapi.io y crear una cuenta gratuita.       │
// │  2. Crear un nuevo proyecto (ej: "vida-natural").               │
// │  3. Crear un recurso llamado "productos" con estos campos:      │
// │                                                                 │
// │     id          (auto, number)                                  │
// │     nombre      (string)                                        │
// │     categoria   (string)                                        │
// │     marca       (string)                                        │
// │     precio      (number)                                        │
// │     stock       (number)                                        │
// │     descripcion (string)                                        │
// │     imagenUrl   (string)                                        │
// │     disponible  (boolean)                                       │
// │                                                                 │
// │  4. Copiar la URL base del recurso. Tendrá este formato:       │
// │     https://xxxxxxxxxxxxxxxx.mockapi.io/api/v1/productos        │
// │                                                                 │
// │  5. Pegar SOLO la parte base en environment.ts:                │
// │     apiUrl: 'https://xxxxxxxxxxxxxxxx.mockapi.io/api/v1'        │
// │                                                                 │
// │  Eso es todo. Este servicio ya está listo para usarla.         │
// └─────────────────────────────────────────────────────────────────┘
//
// Mientras apiUrl esté vacío, el servicio usa datos locales simulados.
// =============================================

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // URL centralizada desde environment.ts
  // Para cambiar la API: solo editar ese archivo, nada más.
  private readonly apiUrl = environment.apiUrl;

  // Endpoint final: apiUrl + '/productos'
  private get endpoint(): string {
    return `${this.apiUrl}/productos`;
  }

  // ── Datos locales de respaldo ─────────────────────────────────────────────
  // Se usan mientras MockAPI no esté configurada (apiUrl vacío).
  // Una vez conectada la API, este arreglo no se usa.
  private productosLocales: Product[] = [
    {
      id: 1,
      nombre: 'Aceite de coco orgánico',
      categoria: 'Aceites',
      marca: 'NaturVida',
      precio: 1850,
      stock: 45,
      descripcion: 'Aceite de coco 100% orgánico, prensado en frío.',
      imagenUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
      disponible: true
    },
    {
      id: 2,
      nombre: 'Granola artesanal con frutos rojos',
      categoria: 'Cereales',
      marca: 'GranoNat',
      precio: 980,
      stock: 120,
      descripcion: 'Granola sin conservantes, elaborada con avena y miel pura.',
      imagenUrl: 'https://images.unsplash.com/photo-1517093728584-87eb96a4a94f?w=400&q=80',
      disponible: true
    },
    {
      id: 3,
      nombre: 'Proteína de arveja vegana',
      categoria: 'Suplementos',
      marca: 'VegaPower',
      precio: 4200,
      stock: 30,
      descripcion: 'Proteína vegetal de arveja aislada, sin lactosa ni gluten.',
      imagenUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80',
      disponible: true
    },
    {
      id: 4,
      nombre: 'Té verde matcha japonés',
      categoria: 'Infusiones',
      marca: 'ZenLeaf',
      precio: 1350,
      stock: 0,
      descripcion: 'Matcha ceremonial de primera calidad, cultivado en Japón.',
      imagenUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
      disponible: false
    },
    {
      id: 5,
      nombre: 'Semillas de chía orgánicas',
      categoria: 'Semillas',
      marca: 'NaturVida',
      precio: 620,
      stock: 200,
      descripcion: 'Semillas de chía de cultivo orgánico. Alta fuente de omega-3.',
      imagenUrl: 'https://images.unsplash.com/photo-1612358405976-6c40d12ccca6?w=400&q=80',
      disponible: true
    },
    {
      id: 6,
      nombre: 'Miel de abeja pura',
      categoria: 'Endulzantes',
      marca: 'NaturVida',
      precio: 1100,
      stock: 85,
      descripcion: 'Miel pura de abeja sin procesar, sin aditivos.',
      imagenUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
      disponible: true
    }
  ];

  private nextId = 7; // Solo se usa en modo local

  constructor(private http: HttpClient) {}

  // ── Indica si la API real está configurada ────────────────────────────────
  private get usandoApi(): boolean {
    return this.apiUrl.trim().length > 0;
  }

  // ── getProducts() ─────────────────────────────────────────────────────────
  // GET /productos → retorna todos los productos
  getProducts(): Observable<Product[]> {
    if (this.usandoApi) {
      return this.http.get<Product[]>(this.endpoint).pipe(
        catchError(this.manejarError)
      );
    }
    // Modo local: devuelve copia del arreglo simulado
    return of([...this.productosLocales]).pipe(delay(400));
  }

  // Alias en español (compatibilidad)
  getProductos(): Observable<Product[]> {
    return this.getProducts();
  }

  // ── getProductById() ──────────────────────────────────────────────────────
  // GET /productos/:id → retorna un producto por su ID
  getProductById(id: number): Observable<Product | undefined> {
    if (this.usandoApi) {
      return this.http.get<Product>(`${this.endpoint}/${id}`).pipe(
        catchError(this.manejarError)
      );
    }
    return of(this.productosLocales.find(p => p.id === id)).pipe(delay(300));
  }

  // Alias en español (compatibilidad)
  getProductoPorId(id: number): Observable<Product | undefined> {
    return this.getProductById(id);
  }

  // ── createProduct() ───────────────────────────────────────────────────────
  // POST /productos → crea un nuevo producto
  createProduct(producto: Omit<Product, 'id'>): Observable<Product> {
    if (this.usandoApi) {
      return this.http.post<Product>(this.endpoint, producto).pipe(
        catchError(this.manejarError)
      );
    }
    // Modo local
    const nuevoProducto: Product = { ...producto, id: this.nextId++ };
    this.productosLocales.push(nuevoProducto);
    return of(nuevoProducto).pipe(delay(400));
  }

  // Alias en español (compatibilidad)
  crearProducto(producto: Omit<Product, 'id'>): Observable<Product> {
    return this.createProduct(producto);
  }

  // ── updateProduct() ───────────────────────────────────────────────────────
  // PUT /productos/:id → actualiza un producto
  updateProduct(id: number, cambios: Partial<Product>): Observable<Product> {
    if (this.usandoApi) {
      return this.http.put<Product>(`${this.endpoint}/${id}`, cambios).pipe(
        catchError(this.manejarError)
      );
    }
    // Modo local
    const idx = this.productosLocales.findIndex(p => p.id === id);
    if (idx === -1) return throwError(() => new Error('Producto no encontrado'));
    this.productosLocales[idx] = { ...this.productosLocales[idx], ...cambios };
    return of(this.productosLocales[idx]).pipe(delay(400));
  }

  // Alias en español (compatibilidad)
  actualizarProducto(id: number, cambios: Partial<Product>): Observable<Product> {
    return this.updateProduct(id, cambios);
  }

  // ── deleteProduct() ───────────────────────────────────────────────────────
  // DELETE /productos/:id → elimina un producto
  // map(() => true) convierte la respuesta vacía del servidor en un boolean
  deleteProduct(id: number): Observable<boolean> {
    if (this.usandoApi) {
      return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(
        map(() => true),         // La respuesta DELETE es vacía; la convertimos a true
        catchError(this.manejarError)
      );
    }
    // Modo local
    const idx = this.productosLocales.findIndex(p => p.id === id);
    if (idx === -1) return throwError(() => new Error('Producto no encontrado'));
    this.productosLocales.splice(idx, 1);
    return of(true).pipe(delay(300));
  }

  // Alias en español (compatibilidad)
  eliminarProducto(id: number): Observable<boolean> {
    return this.deleteProduct(id);
  }

  // ── getCategorias() ───────────────────────────────────────────────────────
  getCategorias(): string[] {
    const categorias = this.productosLocales.map(p => p.categoria);
    return [...new Set(categorias)].sort();
  }

  // ── comprarProducto() ────────────────────────────────────────────────────
  // Reduce el stock del producto en la cantidad indicada.
  // Pasos:
  //   1. Obtiene el producto actual (GET)
  //   2. Valida que haya stock suficiente
  //   3. Calcula el nuevo stock
  //   4. Si nuevoStock === 0 → disponible = false
  //   5. Actualiza el producto en MockAPI (PUT)
  comprarProducto(id: number, cantidad: number): Observable<Product> {
    return this.getProductById(id).pipe(
      switchMap(producto => {
        if (!producto) {
          return throwError(() => new Error('Producto no encontrado.'));
        }
        if (!producto.disponible || producto.stock === 0) {
          return throwError(() => new Error('El producto no está disponible.'));
        }
        if (cantidad > producto.stock) {
          return throwError(() => new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades.`));
        }

        const nuevoStock = producto.stock - cantidad;
        const cambios: Partial<Product> = {
          stock:      nuevoStock,
          disponible: nuevoStock > 0  // false automáticamente si agota el stock
        };

        return this.updateProduct(id, cambios);
      })
    );
  }

  // ── agregarStock() ────────────────────────────────────────────────────────
  // Aumenta el stock del producto en la cantidad indicada (solo admin).
  // Pasos:
  //   1. Obtiene el producto actual (GET)
  //   2. Calcula: nuevoStock = stockActual + cantidad
  //   3. Si nuevoStock > 0 → disponible = true (reactiva el producto)
  //   4. Actualiza el producto en MockAPI (PUT)
  agregarStock(id: number, cantidad: number): Observable<Product> {
    return this.getProductById(id).pipe(
      switchMap(producto => {
        if (!producto) {
          return throwError(() => new Error('Producto no encontrado.'));
        }
        if (cantidad <= 0) {
          return throwError(() => new Error('La cantidad debe ser mayor a 0.'));
        }

        const nuevoStock = producto.stock + cantidad;
        const cambios: Partial<Product> = {
          stock:      nuevoStock,
          disponible: true  // Al agregar stock, el producto vuelve a estar disponible
        };

        return this.updateProduct(id, cambios);
      })
    );
  }

  // ── Manejo de errores HTTP ────────────────────────────────────────────────
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensaje = 'Ocurrió un error al comunicarse con el servidor.';

    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor. Verificá tu conexión.';
    } else if (error.status === 404) {
      mensaje = 'Recurso no encontrado en el servidor.';
    } else if (error.status >= 500) {
      mensaje = 'Error interno del servidor. Intentá más tarde.';
    }

    console.error('[ProductService] Error HTTP:', error.status, mensaje);
    return throwError(() => new Error(mensaje));
  }
}
