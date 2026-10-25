import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html',
  styleUrls: ['./producto-editar.component.css']
})
export class ProductoEditarComponent implements OnInit {

  formulario!: FormGroup;
  guardando = false;
  cargando  = true;
  error     = '';
  productoId!: number;
  nombreProducto = '';  // Para mostrar en el título

  categorias = [
    'Aceites', 'Cereales', 'Endulzantes', 'Especias', 'Infusiones',
    'Lácteos', 'Semillas', 'Snacks', 'Suplementos', 'Bebidas', 'Otros'
  ];

  constructor(
    private fb:             FormBuilder,
    private route:          ActivatedRoute,
    private router:         Router,
    private productService: ProductService,
    private snackBar:       MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productoId = Number(idParam);

    if (isNaN(this.productoId)) {
      this.error    = 'ID de producto inválido.';
      this.cargando = false;
      return;
    }

    this.inicializarFormulario();
    this.cargarProducto();
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3)]],
      categoria:   ['', Validators.required],
      marca:       ['', Validators.required],
      precio:      [null, [Validators.required, Validators.min(1)]],
      stock:       [0,    [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagenUrl:   [''],
      disponible:  [true]
    });
  }

  private cargarProducto(): void {
    this.productService.getProductById(this.productoId).subscribe({
      next: (producto) => {
        if (!producto) {
          this.error    = 'Producto no encontrado.';
          this.cargando = false;
          return;
        }

        this.nombreProducto = producto.nombre;

        // patchValue rellena el formulario con los datos del producto cargado
        this.formulario.patchValue({
          nombre:      producto.nombre,
          categoria:   producto.categoria,
          marca:       producto.marca,
          precio:      producto.precio,
          stock:       producto.stock,
          descripcion: producto.descripcion,
          imagenUrl:   producto.imagenUrl,
          disponible:  producto.disponible
        });

        this.cargando = false;
      },
      error: () => {
        this.error    = 'Error al cargar el producto.';
        this.cargando = false;
      }
    });
  }

  get f() { return this.formulario.controls; }

  onGuardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;

    this.productService.updateProduct(this.productoId, this.formulario.value).subscribe({
      next: (productoActualizado) => {
        this.guardando = false;
        this.snackBar.open(`"${productoActualizado.nombre}" actualizado correctamente.`, 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.guardando = false;
        this.snackBar.open('Error al actualizar el producto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/productos', this.productoId]);
  }
}
