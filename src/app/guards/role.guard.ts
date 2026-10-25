import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// RoleGuard protege rutas que solo pueden acceder ciertos roles.
//
// Uso en el routing:
//   canActivate: [AuthGuard, RoleGuard],
//   data: { roles: ['admin'] }
//
// Si el usuario no tiene el rol requerido, lo redirige al inicio.
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Leemos los roles permitidos desde el "data" de la ruta
    const rolesPermitidos: string[] = route.data['roles'];

    // Obtenemos el rol del usuario logueado
    const rolActual = this.authService.getRole();

    // Verificamos si el rol del usuario está en la lista de roles permitidos
    if (rolActual && rolesPermitidos.includes(rolActual)) {
      return true; // Tiene permiso: puede acceder
    }

    // No tiene el rol requerido: lo redirigimos al inicio
    this.router.navigate(['/inicio']);
    return false;
  }
}
