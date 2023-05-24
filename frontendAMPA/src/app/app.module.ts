import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

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
import { GestionProductosComponent } from './components/admin/gestion-productos/gestion-productos.component';
import { GestionPedidosComponent } from './components/admin/gestion-pedidos/gestion-pedidos.component';
import { GestionPagosComponent } from './components/admin/gestion-pagos/gestion-pagos.component';
import { GestionBalanceComponent } from './components/admin/gestion-balance/gestion-balance.component';
import { BuzonComponent } from './components/admin/buzon/buzon.component';
import { GestionEventosComponent } from './components/admin/gestion-eventos/gestion-eventos.component';
import { GestionVistasComponent } from './components/admin/gestion-vistas/gestion-vistas.component';
import { GestionNoticiasComponent } from './components/admin/gestion-noticias/gestion-noticias.component';
import { GestionCitasComponent } from './components/admin/gestion-citas/gestion-citas.component';
import { NavbarGestionComponent } from './layouts/navbar-gestion/navbar-gestion.component';
import { SocioComponent } from './components/admin/forms/socio/socio.component';
import { EventoComponent } from './components/admin/forms/evento/evento.component';
import { NoticiaComponent } from './components/admin/forms/noticia/noticia.component';
import { ProductoComponent } from './components/admin/forms/producto/producto.component';
import { GestionColaboradoresComponent } from './components/admin/gestion-colaboradores/gestion-colaboradores.component';
import { ColaboradorComponent } from './components/admin/forms/colaborador/colaborador.component';
import { ShowEventoComponent } from './components/admin/shows/show-evento/show-evento.component';
import { ShowColaboradorComponent } from './components/admin/shows/show-colaborador/show-colaborador.component';
import { ShowPedidoComponent } from './components/admin/shows/show-pedido/show-pedido.component';
import { ShowNoticiaComponent } from './components/admin/shows/show-noticia/show-noticia.component';
import { ShowProductoComponent } from './components/admin/shows/show-producto/show-producto.component';
import { ShowBalanceComponent } from './components/admin/shows/show-balance/show-balance.component';
import { InfoColegioComponent } from './components/public/info-colegio/info-colegio.component';
import { InfoComedorComponent } from './components/public/info-comedor/info-comedor.component';
import { InfoContactoComponent } from './components/public/info-contacto/info-contacto.component';
import { TiendaComponent } from './components/public/tienda/tienda.component';
import { NoticiasComponent } from './components/public/noticias/noticias.component';
import { EventosComponent } from './components/public/eventos/eventos.component';
import { ShowAsuntoComponent } from './components/admin/shows/show-asunto/show-asunto.component';

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
    GestionSociosComponent,
    GestionProductosComponent,
    GestionPedidosComponent,
    GestionPagosComponent,
    GestionBalanceComponent,
    BuzonComponent,
    GestionEventosComponent,
    GestionVistasComponent,
    GestionNoticiasComponent,
    GestionCitasComponent,
    NavbarGestionComponent,
    SocioComponent,
    EventoComponent,
    NoticiaComponent,
    ProductoComponent,
    GestionColaboradoresComponent,
    ColaboradorComponent,
    ShowEventoComponent,
    ShowColaboradorComponent,
    ShowPedidoComponent,
    ShowNoticiaComponent,
    ShowProductoComponent,
    ShowBalanceComponent,
    InfoColegioComponent,
    InfoComedorComponent,
    InfoContactoComponent,
    TiendaComponent,
    NoticiasComponent,
    EventosComponent,
    ShowAsuntoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
