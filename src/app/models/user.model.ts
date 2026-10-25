// Modelo para el usuario autenticado
export interface User {
  id:     number;
  nombre: string;
  email:  string;
  rol:    string;   // 'admin' | 'usuario'
}

// Credenciales que el usuario ingresa en el formulario de login
export interface LoginCredentials {
  email:    string;
  password: string;
}
