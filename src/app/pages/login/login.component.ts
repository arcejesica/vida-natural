import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;
  cargando    = false;
  mensajeError = '';
  mostrarPassword = false; // Controla si se muestra el texto de la contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir al inicio
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicio']);
      return;
    }

    // Definimos el formulario reactivo con validaciones
    this.formulario = this.fb.group({
      email: [
        '',
        [
          Validators.required,          // Campo obligatorio
          Validators.email              // Formato de email válido
        ]
      ],
      password: [
        '',
        [
          Validators.required,          // Campo obligatorio
          Validators.minLength(6)       // Mínimo 6 caracteres
        ]
      ]
    });
  }

  // Accesores para simplificar las validaciones en el template
  get email()    { return this.formulario.get('email')!; }
  get password() { return this.formulario.get('password')!; }

  onLogin(): void {
    this.mensajeError = '';

    // Si el formulario es inválido, marcamos todos los campos como tocados
    // para que se muestren los mensajes de error
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.login(this.formulario.value).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.mensaje || 'Ocurrió un error al iniciar sesión.';
      }
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
