import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra.model';
import { environment } from '../../environments/environment';

// =============================================
// CompraService — Acceso a MockAPI /compras.
//
// Flujo:
//   Componente → CompraService → HttpClient → MockAPI
//
// Recurso MockAPI necesario ("compras") con campos:
//   id, usuarioEmail, usuarioNombre, productoId,
//   productoNombre, cantidad, precioUnitario, total, fecha
// =============================================

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private readonly endpoint = `${environment.apiUrl}/compras`;

  constructor(private http: HttpClient) {}

  // ── registrarCompra() ─────────────────────────────────────────────────────
  // POST /compras → guarda la compra en MockAPI
  // usuarioEmail y usuarioNombre se obtienen del AuthService en el componente
  // y se pasan aquí; el usuario nunca los escribe manualmente.
  registrarCompra(compra: Omit<Compra, 'id'>): Observable<Compra> {
    return this.http.post<Compra>(this.endpoint, compra);
  }

  // ── getComprasUsuario() ───────────────────────────────────────────────────
  // GET /compras?usuarioEmail=xxx
  // MockAPI filtra por query param → solo devuelve compras del usuario logueado
  getComprasUsuario(email: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.endpoint, {
      params: { usuarioEmail: email }
    });
  }

  // ── getTodasLasCompras() ──────────────────────────────────────────────────
  // GET /compras → trae TODAS las compras (solo para admin)
  // El componente AdminComprasComponent llama este método;
  // la ruta /admin/compras está protegida con RoleGuard.
  getTodasLasCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.endpoint);
  }
}
