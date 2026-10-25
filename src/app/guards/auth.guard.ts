import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// AuthGuard protege las rutas privadas.
// Si el usuario NO está autenticado, lo redirige al login.
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // El usuario está logueado: puede acceder a la ruta
    }

    // No hay sesión activa: redirigimos al login
    this.router.navigate(['/login']);
    return false;
  }
}
