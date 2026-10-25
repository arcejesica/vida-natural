# TRABAJO PRÁCTICO: MANUAL DE USUARIO Y GUÍA DE OPERACIÓN
## Plataforma Web "Vida Natural" — Tienda de Alimentos Saludables

---

## 1. INTRODUCCIÓN Y OBJETIVO DEL SISTEMA

### 1.1 Propósito y Alcance de la Plataforma
**Vida Natural** es una aplicación web interactiva desarrollada sobre el framework **Angular 17** y componentes de **Angular Material**, orientada a la comercialización y administración de productos orgánicos, suplementos dietarios y alimentos saludables.

La plataforma resuelve dos necesidades centrales:
1. **Para los Clientes / Consumidores:** Brindar un canal accesible donde explorar el catálogo de productos disponibles, consultar datos nutricionales oficiales a través de la integración en tiempo real con la base internacional de *Open Food Facts*, adquirir productos con confirmación de stock inmediata y llevar el seguimiento de sus compras.
2. **Para los Administradores:** Ofrecer un panel de control con métricas en tiempo real, administración completa del catálogo (alta, edición, reposición de inventario y baja lógica/física mediante diálogos modales) y auditoría global de compras de todos los clientes.

### 1.2 Perfiles de Usuario y Credenciales de Evaluación
Para facilitar el proceso de evaluación académica, el sistema incorpora dos cuentas preconfiguradas con diferentes privilegios y niveles de acceso:

| Perfil / Rol | Correo Electrónico | Contraseña | Privilegios y Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@vidanatural.com` | `admin123` | Control total del catálogo (crear, editar, eliminar), reposición de stock, visualización de métricas y auditoría global de todas las compras. |
| **Usuario / Cliente** | `usuario@vidanatural.com` | `usuario123` | Exploración del catálogo, consulta nutricional en Open Food Facts, compra de productos con actualización de stock y consulta de su historial personal en "Mis compras". |

> **Nota:** La pantalla de inicio de sesión dispone de una barra inferior de **"Acceso rápido"** que permite autocompletar estas credenciales con un solo clic.

---

## 2. GUÍA DE NAVEGACIÓN E INTERFAZ DE USUARIO

### 2.1 Estilo Visual y Distribución de Pantalla
La aplicación combina el framework de estilos **Bootstrap 5** con la librería oficial **Angular Material 17**:
* **Identidad Visual:** Tonos verdes botánicos y terrosos (`#2e7d32`, `#1b5e20`, `#f4f8f4`) que transmiten naturaleza, salud y sustentabilidad.
* **Tipografía:** Se utiliza la fuente moderna *Poppins* (Google Fonts) para garantizar legibilidad y estética profesional.
* **Diseño Responsivo:** Todas las vistas se adaptan fluidamente a pantallas de escritorio, tablets y dispositivos móviles con menú hamburguesa colapsable.

### 2.2 Barra de Navegación Inteligente (`Navbar`)
La barra de navegación permanece anclada en la parte superior una vez iniciada la sesión y adapta sus opciones de acuerdo con el rol autenticado:

```
+-----------------------------------------------------------------------------------------------------+
| [Tree Icon] Vida Natural   |   Inicio   |   Productos   |   Buscar alimentos   |   [Compras] (Admin)|
|                                                                                                     |
|                                                     [User Icon] Administrador (Admin)  [Salir Btn]  |
+-----------------------------------------------------------------------------------------------------+
```

* **Logo y Enlace a Inicio:** Hace clic en "Vida Natural" para volver rápidamente al Dashboard.
* **Menú "Inicio":** Panel de control con métricas e indicadores de stock.
* **Menú "Productos":** Acceso al catálogo interactivo y herramientas de inventario.
* **Menú "Buscar alimentos":** Motor de consulta externa contra Open Food Facts.
* **Menú "Mis compras" (Exclusivo Rol Usuario):** Historial personal de compras del cliente.
* **Menú "Compras" (Exclusivo Rol Admin):** Auditoría general de compras realizadas por todos los usuarios.
* **Identificador de Usuario y Rol:** Chip/Badge con ícono de escudo (para Admin) o usuario (para Cliente).
* **Botón "Salir":** Cierra la sesión activa de forma segura y devuelve al usuario a la pantalla de login.

---

## 3. CASOS DE USO Y FLUJOS OPERATIVOS PASO A PASO

### 3.1 Flujo 1: Inicio de Sesión y Acceso al Sistema

```
[Pantalla Login] ---> Ingrese Correo y Contraseña ---> [Validaciones Reactivas]
                                  |
                                  v
                   ¿Credenciales Válidas?
                   /                    \
             (Sí) /                      \ (No)
                 v                        v
         Redirección a /inicio      Muestra Alerta Roja
```

1. Ingrese a la aplicación (por defecto se abrirá la vista `/login`).
2. Introduzca su correo electrónico y su contraseña en los campos correspondientes.
   * *Opcional:* Utilice los botones de **"Admin"** o **"Usuario"** ubicados en la sección inferior de "Acceso rápido" para rellenar los campos automáticamente.
3. Presione el botón **"Ingresar"**.
   * Durante la verificación, se desplegará un indicador giratorio animado de Angular Material (`<mat-spinner>`).
4. Si los datos son correctos, el sistema guardará su sesión y lo redirigirá a la vista principal (`/inicio`). En caso contrario, se mostrará una advertencia contextual informando el error.

---

### 3.2 Flujo 2: Consulta del Panel de Control (Dashboard)

Al ingresar a la sección **Inicio**, se exhibe una panorámica completa del estado del negocio:
1. **Tarjetas de Estadísticas:**
   * **Total de Productos:** Cantidad global de artículos registrados en el catálogo.
   * **Disponibles:** Cantidad de artículos con estado activo y existencias reales (`stock > 0`).
   * **Sin Stock:** Artículos cuyo inventario se encuentra agotado (`stock = 0`). Resaltado en color rojo.
   * **Stock Bajo:** Artículos con inventario crítico (entre 1 y 10 unidades). Resaltado en amarillo preventivo.
2. **Productos Destacados:** Muestra las tres primeras tarjetas de producto del catálogo. Al hacer clic en el botón **"Ver más"**, el componente hijo emite un evento que redirige a la vista detallada del artículo.
3. **Accesos Rápidos:** Enlaces directos a las funciones más frecuentes. Si el usuario posee rol Administrador, se habilita el botón directo para **"Nuevo producto"**.

---

### 3.3 Flujo 3: Búsqueda Nutricional en Tiempo Real (Open Food Facts)

Esta funcionalidad permite consultar información oficial de alimentos en el mercado sin mezclarse con la base de datos de la tienda:

1. Diríjase a la sección **"Buscar alimentos"** en la barra superior.
2. Escriba el nombre de un alimento o ingrediente en el campo de texto (ejemplo: *avena*, *chocolate*, *miel*, *galletitas*).
3. Presione la tecla **Enter** o haga clic en el botón **"Buscar"**.
4. El sistema se conectará a la API internacional de Open Food Facts y presentará una cuadrícula con los resultados obtenidos:
   * **Fotografía oficial** del producto (o marcador de posición si no está disponible).
   * **Nombre comercial y Marca fabricante.**
   * **Categoría principal.**
   * **Insignia Nutri-Score:** Calificación nutricional de la A a la E con código de color oficial (Verde intenso para A, rojo para E).
   * **Información Nutricional:** Calorías (kcal) y Proteínas (g) calculadas por cada 100 gramos de producto.
5. Para reiniciar la consulta, haga clic en el botón **"Limpiar"**.

---

### 3.4 Flujo 4: Exploración del Catálogo y Compra de Productos (Rol Usuario)

```
[Lista de Productos] ---> Filtrar por Nombre / Categoría ---> Clic en "Ver más"
                                                                     |
                                                                     v
[Pantalla de Detalle] <--- Seleccionar Cantidad <--- Revisar Stock y Precio
         |
         v
Clic en "Comprar ahora" ---> [Modal Angular Material] ---> Confirmar Compra
                                                                  |
                                                                  v
                              Stock Descontado en MockAPI + Comprobante Registrado
```

1. Ingrese a la sección **"Productos"**.
2. **Filtrar y Buscar:**
   * Utilice la caja de texto para filtrar de manera reactiva por nombre o marca (búsqueda instantánea asistida por RxJS).
   * Seleccione una categoría en el menú desplegable (ej. *Aceites*, *Cereales*, *Suplementos*).
3. Haga clic sobre la tarjeta del producto deseado presionando el botón **"Ver más"**.
4. En la pantalla de detalle del producto, observará la fotografía en alta resolución, la descripción completa, el precio unitario y el stock actual.
5. En la sección **"Adquirir producto"**:
   * Defina la cantidad deseada mediante los controles numéricos (el sistema impide seleccionar más unidades que las existentes en bodega).
   * Verifique el cálculo del subtotal en pantalla.
6. Haga clic en **"Comprar ahora"**.
7. Se desplegará una **Ventana Modal de Angular Material (`MatDialog`)** con el resumen de la operación: Nombre del producto, Cantidad, Precio unitario y Monto total.
8. Presione **"Confirmar compra"**:
   * La aplicación actualizará el stock en el servidor en tiempo real.
   * Si el stock llega a 0, el producto pasará automáticamente a estado "Sin stock".
   * Se registrará la transacción vinculada a su cuenta.
   * Se emitirá una notificación emergente (*SnackBar*) confirmando la operación.

---

### 3.5 Flujo 5: Gestión del Catálogo y Reposición de Inventario (Rol Administrador)

Cuando se accede con el usuario administrador (`admin@vidanatural.com`), la plataforma habilita herramientas exclusivas de gestión:

#### A. Dar de Alta un Nuevo Producto
1. Diríjase a **"Productos"** y presione el botón superior **"+ Nuevo producto"** (o use el acceso rápido del Dashboard).
2. Complete el formulario reactivo:
   * **Nombre del producto** (mínimo 3 caracteres, obligatorio).
   * **Categoría** (seleccione una de la lista predefinida).
   * **Marca** (obligatorio).
   * **Precio en Pesos** (debe ser un valor positivo mayor a 0).
   * **Stock Inicial** (número entero mayor o igual a 0).
   * **URL de la Imagen** (enlace web a una imagen del producto).
   * **Descripción** (características y beneficios del artículo).
   * **Disponibilidad** (casilla de verificación).
3. Presione **"Guardar producto"**. Al finalizar, el sistema lo notificará mediante un mensaje emergente y lo devolverá al catálogo.

#### B. Modificar un Producto Existente
1. En el catálogo o en el detalle del producto, presione el botón **"Editar"** (ícono de lápiz).
2. El formulario se precargará automáticamente con la información actual del producto.
3. Modifique los campos necesarios y presione **"Guardar cambios"**.

#### C. Reposición Rápida de Stock
1. Ingrese al detalle de cualquier producto (`/productos/:id`).
2. En el panel lateral reservado para el Administrador, ubique la sección **"Reponer inventario"**.
3. Indique la cantidad de unidades que ingresaron a bodega (ejemplo: `20`) y presione **"Agregar unidades"**.
4. El stock se sumará de inmediato y, en caso de que el producto se encontrara agotado, volverá a habilitarse como "Disponible" automáticamente.

#### D. Eliminación Segura de un Producto
1. Presione el botón **"Eliminar"** (ícono de cesto de basura) ubicado en la tarjeta del producto o en su página de detalle.
2. El sistema abrirá un diálogo de confirmación de Angular Material para prevenir borrados accidentales.
3. Presione **"Eliminar definitivamente"** para confirmar la baja en la base de datos de MockAPI.

---

### 3.6 Flujo 6: Consulta de Historiales de Compra

#### A. Para Clientes ("Mis compras")
* Ingrese a la pestaña **"Mis compras"**.
* Podrá revisar una tabla cronológica con todas las compras realizadas por su usuario, con indicación de producto, cantidad, precio histórico, total y fecha exacta.
* En la cabecera se visualiza un badge con el **Monto total gastado acumulado**.

#### B. Para Administradores ("Compras")
* Ingrese a la pestaña **"Compras"** (accesible únicamente con rol Admin; protegida por `RoleGuard`).
* El panel presenta métricas de **Total de órdenes** y **Total de dinero facturado**.
* Incluye un buscador multidimensional en vivo que permite filtrar las compras por:
  * Nombre del cliente.
  * Correo electrónico del cliente.
  * Nombre del producto adquirido.
* Presione el botón con ícono de cruz para limpiar los filtros y reestablecer la vista general.

---

## 4. PREGUNTAS FRECUENTES (FAQ) Y RESOLUCIÓN DE PROBLEMAS

### P1: ¿Por qué no puedo ingresar a la ruta `/admin/compras` con mi usuario?
**Respuesta:** La ruta `/admin/compras` está protegida a nivel de enrutador mediante un guardián de seguridad (`RoleGuard`). Si un usuario con rol estándar (`usuario`) intenta tipear dicha URL en la barra de direcciones del navegador, el sistema detecta que sus privilegios son insuficientes y lo redirige automáticamente a la página de inicio (`/inicio`).

### P2: ¿Qué sucede si recargo la página mientras navego en el sistema?
**Respuesta:** La sesión no se pierde. El servicio de autenticación (`AuthService`) mantiene sincronizado el estado del usuario en el `localStorage` del navegador. Al recargar la página, el estado se reconstituye de manera transparente sin solicitar credenciales nuevamente.

### P3: ¿Qué ocurre cuando el stock de un producto llega a 0 tras una compra?
**Respuesta:** El algoritmo del servicio valida el nuevo saldo de stock. Al alcanzar 0 unidades, el atributo `disponible` conmuta automáticamente a `false`. En la interfaz, la tarjeta del producto exhibirá la etiqueta roja de **"Sin stock"** y el botón de compra quedará inhabilitado para los clientes. Un administrador puede reactivarlo en cualquier momento utilizando el panel de **"Reponer inventario"**.

### P4: ¿Cómo puedo cambiar la base de datos de MockAPI si la actual expira o se reinicia?
**Respuesta:** Toda la configuración de red se encuentra desacoplada en el archivo `src/environments/environment.ts`. Únicamente debe modificarse la propiedad `apiUrl` con la nueva dirección provista por MockAPI:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://tu-nuevo-endpoint.mockapi.io/api/v1'
};
```
No es necesario modificar ningún componente ni ningún servicio; la aplicación adaptará todos sus endpoints automáticamente.

### P5: Al buscar alimentos en Open Food Facts obtengo un mensaje de error o sin conexión.
**Respuesta:** Este módulo consume una API pública externa gratuita. Verifique que el dispositivo cuente con salida a Internet sin bloqueos por proxy escolar/institucional. Si el servicio de Open Food Facts se encuentra en mantenimiento momentáneo, la aplicación atrapará el error de forma segura mediante su operador `catchError` y mostrará una alerta descriptiva al usuario sin interrumpir la ejecución del resto del sistema.

### P6: ¿Cómo se restablece la sesión a un estado limpio?
**Respuesta:** Puede hacer clic en el botón **"Salir"** en la esquina superior derecha del Navbar, o bien abrir las herramientas de desarrollo del navegador (`F12`), dirigirse a la pestaña *Application* > *Local Storage* y eliminar la clave `vn_user`.

---
*Fin del Manual de Usuario y Guía Operativa — Proyecto Vida Natural*
