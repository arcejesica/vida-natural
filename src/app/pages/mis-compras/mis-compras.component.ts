import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { AuthService } from '../../services/auth.service';
import { Compra } from '../../models/compra.model';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.component.html',
  styleUrls: ['./mis-compras.component.css']
})
export class MisComprasComponent implements OnInit {

  compras:  Compra[] = [];
  cargando  = true;
  error     = '';
  emailUsuario = '';

  constructor(
    private compraService: CompraService,
    private authService:   AuthService
  ) {}

  ngOnInit(): void {
    // Obtenemos el email del usuario logueado desde AuthService
    const usuario = this.authService.usuarioActualValor;
    this.emailUsuario = usuario?.email || '';

    if (!this.emailUsuario) {
      this.error    = 'No se pudo identificar al usuario.';
      this.cargando = false;
      return;
    }

    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.error    = '';

    // GET /compras?usuarioEmail=xxx → solo las compras del usuario logueado
    this.compraService.getComprasUsuario(this.emailUsuario).subscribe({
      next: (compras) => {
        // Ordenamos de más reciente a más antigua
        this.compras  = compras.sort((a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error    = 'No se pudieron cargar las compras.';
      }
    });
  }

  // Calcula el total general de todas las compras
  get totalGastado(): number {
    return this.compras.reduce((acc, c) => acc + c.total, 0);
  }
}
