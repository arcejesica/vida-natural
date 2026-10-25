import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Controla si se muestra el navbar (solo en rutas autenticadas)
  mostrarNavbar = false;

  constructor(private router: Router) {
    // Escuchamos los cambios de ruta para mostrar/ocultar el navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // El navbar NO se muestra en el login
      this.mostrarNavbar = !event.urlAfterRedirects.includes('/login');
    });
  }
}
