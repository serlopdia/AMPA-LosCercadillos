import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginAdminComponent } from './components/admin/login-admin/login-admin.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './components/index/index.component';
import { UnauthorizedComponent } from './layouts/unauthorized/unauthorized.component';
import { GestionSociosComponent } from './components/admin/gestion-socios/gestion-socios.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginAdminComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    IndexComponent,
    UnauthorizedComponent,
    GestionSociosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
