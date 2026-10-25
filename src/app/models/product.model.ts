// Modelo principal de Producto para la tienda Vida Natural

export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagenUrl: string;
  disponible: boolean;
}
