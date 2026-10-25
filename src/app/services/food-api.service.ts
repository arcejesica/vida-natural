import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// =============================================
// FoodApiService — Servicio exclusivo para la API externa Open Food Facts.
//
// Arquitectura clara:
//   ProductService  → MockAPI (productos propios de la tienda)
//   FoodApiService  → Open Food Facts (consulta de información nutricional)
//
// Los datos de ambas APIs son INDEPENDIENTES y NO se mezclan.
// =============================================

// Modelo que representa un alimento devuelto por Open Food Facts
export interface AlimentoExterno {
  nombre:      string;   // product_name
  marca:       string;   // brands
  categoria:   string;   // categories (primera categoría)
  imagenUrl:   string;   // image_url
  nutriScore:  string;   // nutriscore_grade (A, B, C, D, E)
  calorias:    number | null;  // nutriments.energy-kcal_100g
  proteinas:   number | null;  // nutriments.proteins_100g
}

// Respuesta cruda de la API (no modificar — es el formato de Open Food Facts)
interface RespuestaOpenFoodFacts {
  count:    number;
  products: ProductoCrudo[];
}

interface ProductoCrudo {
  product_name?:      string;
  brands?:            string;
  categories?:        string;
  image_url?:         string;
  nutriscore_grade?:  string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?:       number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FoodApiService {

  // URL base de la API pública Open Food Facts (no requiere clave ni registro)
  private readonly API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient) {}

  // ── buscarAlimentos() ─────────────────────────────────────────────────────
  // Realiza una búsqueda en Open Food Facts y transforma la respuesta
  // al modelo interno AlimentoExterno (más simple y tipado).
  buscarAlimentos(termino: string): Observable<AlimentoExterno[]> {
    const params = {
      search_terms: termino,
      action:       'process',
      json:         '1',
      page_size:    '12',
      // Pedimos solo los campos que necesitamos (optimiza la respuesta)
      fields: 'product_name,brands,categories,image_url,nutriscore_grade,nutriments'
    };

    return this.http.get<RespuestaOpenFoodFacts>(this.API_URL, { params }).pipe(
      // Transformamos la respuesta cruda al modelo interno
      map(respuesta => this.transformarResultados(respuesta.products)),
      catchError(this.manejarError)
    );
  }

  // Transforma el array de productos crudos al modelo limpio AlimentoExterno
  private transformarResultados(productos: ProductoCrudo[]): AlimentoExterno[] {
    return productos
      .filter(p => p.product_name)   // Descartar productos sin nombre
      .map(p => ({
        nombre:     p.product_name  || 'Sin nombre',
        marca:      p.brands        || 'No disponible',
        // Tomamos solo la primera categoría (suelen venir varias separadas por coma)
        categoria:  p.categories
                      ? p.categories.split(',')[0].trim()
                      : 'No disponible',
        imagenUrl:  p.image_url     || '',
        nutriScore: p.nutriscore_grade?.toUpperCase() || '',
        calorias:   p.nutriments?.['energy-kcal_100g'] ?? null,
        proteinas:  p.nutriments?.['proteins_100g']    ?? null
      }));
  }

  // Manejo de errores de la API externa
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensaje = 'No se pudo conectar con Open Food Facts. Verificá tu conexión.';

    if (error.status === 0) {
      mensaje = 'Sin conexión. Verificá tu acceso a internet.';
    } else if (error.status >= 500) {
      mensaje = 'La API externa no está disponible en este momento.';
    }

    console.error('[FoodApiService] Error HTTP:', error.status, mensaje);
    return throwError(() => new Error(mensaje));
  }
}
