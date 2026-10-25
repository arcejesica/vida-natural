import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioActual: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Nos suscribimos al observable para reaccionar a cambios de sesión en tiempo real
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  // Retorna true si el usuario logueado es administrador
  get esAdmin(): boolean {
    return this.authService.esAdmin();
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
