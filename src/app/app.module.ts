import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Locale para pipes de moneda y fecha en español/Argentina
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr);

// Routing
import { AppRoutingModule } from './app-routing.module';

// Módulo compartido (Navbar)
import { SharedModule } from './shared/shared.module';

// Componente raíz
import { AppComponent } from './app.component';

// Páginas del módulo raíz (NO están en Lazy Loading)
import { LoginComponent }           from './pages/login/login.component';
import { DashboardComponent }       from './pages/dashboard/dashboard.component';
import { BuscarAlimentosComponent } from './pages/buscar-alimentos/buscar-alimentos.component';
import { MisComprasComponent }      from './pages/mis-compras/mis-compras.component';
import { AdminComprasComponent }    from './pages/admin-compras/admin-compras.component';

// AppModule es el módulo raíz que arranca la aplicación.
// Registra todos los componentes, módulos e importaciones necesarias.
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BuscarAlimentosComponent,
    MisComprasComponent,
    AdminComprasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,            // Para el ngModel del buscar alimentos
    ReactiveFormsModule,    // Para los formularios de login y productos
    HttpClientModule,       // Para el servicio de la API externa
    SharedModule,           // Contiene NavbarComponent
    MatProgressSpinnerModule // Angular Material: spinner en el botón de login
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'es-AR' } // Activa el locale para CurrencyPipe y DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
