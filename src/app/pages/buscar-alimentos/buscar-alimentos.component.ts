import { Component } from '@angular/core';
import { FoodApiService, AlimentoExterno } from '../../services/food-api.service';

@Component({
  selector: 'app-buscar-alimentos',
  templateUrl: './buscar-alimentos.component.html',
  styleUrls: ['./buscar-alimentos.component.css']
})
export class BuscarAlimentosComponent {

  terminoBusqueda = '';
  resultados: AlimentoExterno[] = [];  // Usamos el modelo limpio del servicio
  cargando     = false;
  buscado      = false;      // true cuando el usuario ya realizó al menos una búsqueda
  mensajeError = '';

  constructor(private foodApiService: FoodApiService) {}

  buscar(): void {
    const termino = this.terminoBusqueda.trim();
    if (!termino) return;

    this.cargando     = true;
    this.buscado      = true;
    this.resultados   = [];
    this.mensajeError = '';

    // Llamada al servicio → HttpClient → Open Food Facts API
    this.foodApiService.buscarAlimentos(termino).subscribe({
      next: (alimentos) => {
        this.resultados = alimentos;
        this.cargando   = false;
      },
      error: (err: Error) => {
        this.cargando     = false;
        this.mensajeError = err.message;
      }
    });
  }

  // Retorna el color del badge de Nutri-Score según la letra
  getNutriscoreColor(grado: string): string {
    const colores: { [key: string]: string } = {
      'A': '#21960b',
      'B': '#85bb2f',
      'C': '#f0c605',
      'D': '#e9811c',
      'E': '#e63e11'
    };
    return colores[grado?.toUpperCase()] || '#9e9e9e';
  }

  limpiar(): void {
    this.terminoBusqueda = '';
    this.resultados      = [];
    this.buscado         = false;
    this.mensajeError    = '';
  }

  // Permite buscar presionando Enter en el input
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.buscar();
    }
  }
}
