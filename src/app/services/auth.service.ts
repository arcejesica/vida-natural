import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials } from '../models/user.model';

// =============================================
// Usuarios de prueba para este proyecto universitario.
// En una aplicación real, la validación la haría el backend.
// =============================================
const USUARIOS_PRUEBA: (User & { password: string })[] = [
  {
    id:       1,
    nombre:   'Administrador',
    email:    'admin@vidanatural.com',
    password: 'admin123',
    rol:      'admin'
  },
  {
    id:       2,
    nombre:   'Usuario',
    email:    'usuario@vidanatural.com',
    password: 'usuario123',
    rol:      'usuario'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Claves para guardar la sesión en localStorage
  private readonly USER_KEY = 'vn_user';

  // BehaviorSubject: permite que cualquier componente sepa si el usuario está logueado.
  // Se inicializa leyendo el localStorage (para persistir la sesión al recargar la página).
  private usuarioActual = new BehaviorSubject<User | null>(this.obtenerUsuarioGuardado());

  constructor(private router: Router) {}

  // ── Observable del usuario ─────────────────────────────────────────────────
  // Otros componentes pueden suscribirse para reaccionar a cambios de sesión.
  get usuario$(): Observable<User | null> {
    return this.usuarioActual.asObservable();
  }

  // Retorna el usuario actual directamente (sin necesidad de suscribirse)
  get usuarioActualValor(): User | null {
    return this.usuarioActual.value;
  }

  // ── isAuthenticated() ─────────────────────────────────────────────────────
  // Retorna true si hay un usuario guardado en localStorage.
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  // Alias para mantener compatibilidad con el código existente
  estaLogueado(): boolean {
    return this.isAuthenticated();
  }

  // ── getRole() ─────────────────────────────────────────────────────────────
  // Retorna el rol del usuario logueado ('admin', 'usuario' o null).
  getRole(): string | null {
    const usuario = this.usuarioActual.value;
    return usuario ? usuario.rol : null;
  }

  // Retorna true si el usuario logueado es administrador
  esAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // ── login() ───────────────────────────────────────────────────────────────
  // Valida las credenciales contra la lista de usuarios de prueba.
  // Retorna un Observable para ser consistente con el patrón Angular (HttpClient).
  login(credenciales: LoginCredentials): Observable<User> {
    return new Observable(observer => {
      // Simulamos una pequeña demora de red (como si fuera una llamada HTTP real)
      setTimeout(() => {
        const usuarioEncontrado = USUARIOS_PRUEBA.find(
          u => u.email === credenciales.email && u.password === credenciales.password
        );

        if (usuarioEncontrado) {
          // Creamos el objeto User sin incluir el password
          const usuario: User = {
            id:     usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            email:  usuarioEncontrado.email,
            rol:    usuarioEncontrado.rol
          };
          this.guardarSesion(usuario);
          observer.next(usuario);
          observer.complete();
        } else {
          // Credenciales incorrectas
          observer.error({ mensaje: 'Email o contraseña incorrectos.' });
        }
      }, 600);
    });
  }

  // ── logout() ──────────────────────────────────────────────────────────────
  // Cierra la sesión: limpia localStorage, resetea el BehaviorSubject y redirige.
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.usuarioActual.next(null);
    this.router.navigate(['/login']);
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  // Guarda el usuario en localStorage y actualiza el BehaviorSubject
  private guardarSesion(usuario: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this.usuarioActual.next(usuario);
  }

  // Lee el usuario guardado en localStorage al iniciar la aplicación
  private obtenerUsuarioGuardado(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
