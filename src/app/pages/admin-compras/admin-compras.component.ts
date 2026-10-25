import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/compra.model';

@Component({
  selector: 'app-admin-compras',
  templateUrl: './admin-compras.component.html',
  styleUrls: ['./admin-compras.component.css']
})
export class AdminComprasComponent implements OnInit {

  todasLasCompras:  Compra[] = [];  // Lista completa traída de MockAPI
  comprasFiltradas: Compra[] = [];  // Lista que muestra la tabla
  cargando  = true;
  error     = '';

  // ── Filtros ───────────────────────────────────────────────────────────────
  filtroNombre   = '';
  filtroEmail    = '';
  filtroProducto = '';

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.error    = '';

    // getTodasLasCompras() → GET /compras sin filtros (solo admin llega aquí)
    this.compraService.getTodasLasCompras().subscribe({
      next: (compras: Compra[]) => {
        // Ordenamos de más reciente a más antigua
        this.todasLasCompras  = compras.sort((a: Compra, b: Compra) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.comprasFiltradas = [...this.todasLasCompras];
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error    = 'No se pudieron cargar las compras.';
      }
    });
  }

  // ── aplicarFiltros() ─────────────────────────────────────────────────────
  // Filtra la lista local — no hace otra llamada HTTP
  aplicarFiltros(): void {
    const nombre   = this.filtroNombre.toLowerCase().trim();
    const email    = this.filtroEmail.toLowerCase().trim();
    const producto = this.filtroProducto.toLowerCase().trim();

    this.comprasFiltradas = this.todasLasCompras.filter((compra: Compra) => {
      const coincideNombre   = !nombre   || compra.usuarioNombre.toLowerCase().includes(nombre);
      const coincideEmail    = !email    || compra.usuarioEmail.toLowerCase().includes(email);
      const coincideProducto = !producto || compra.productoNombre.toLowerCase().includes(producto);
      return coincideNombre && coincideEmail && coincideProducto;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre    = '';
    this.filtroEmail     = '';
    this.filtroProducto  = '';
    this.comprasFiltradas = [...this.todasLasCompras];
  }

  // ── Estadísticas ──────────────────────────────────────────────────────────
  get totalCompras(): number {
    return this.comprasFiltradas.length;
  }

  get totalVendido(): number {
    return this.comprasFiltradas.reduce((acc: number, c: Compra) => acc + c.total, 0);
  }
}
