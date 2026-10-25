import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-producto-nuevo',
  templateUrl: './producto-nuevo.component.html',
  styleUrls: ['./producto-nuevo.component.css']
})
export class ProductoNuevoComponent implements OnInit {

  formulario!: FormGroup;
  guardando = false;

  categorias = [
    'Aceites', 'Cereales', 'Endulzantes', 'Especias', 'Infusiones',
    'Lácteos', 'Semillas', 'Snacks', 'Suplementos', 'Bebidas', 'Otros'
  ];

  constructor(
    private fb:             FormBuilder,
    private productService: ProductService,
    private router:         Router,
    private snackBar:       MatSnackBar
  ) {}

  ngOnInit(): void {
    // Formulario reactivo con validaciones
    this.formulario = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3)]],
      categoria:   ['', Validators.required],
      marca:       ['', Validators.required],
      precio:      [null, [Validators.required, Validators.min(1)]],   // mayor a 0
      stock:       [0,    [Validators.required, Validators.min(0)]],   // no negativo
      descripcion: [''],
      imagenUrl:   [''],
      disponible:  [true]
    });
  }

  // Acceso rápido a los controles para las validaciones en el template
  get f() { return this.formulario.controls; }

  onGuardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;

    this.productService.createProduct(this.formulario.value).subscribe({
      next: (productoCreado) => {
        this.guardando = false;
        this.snackBar.open(`"${productoCreado.nombre}" creado correctamente.`, 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.guardando = false;
        this.snackBar.open('Error al crear el producto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
