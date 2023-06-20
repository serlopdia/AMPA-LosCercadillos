import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { UsuarioGuard } from './guards/usuario.guard';
import { SocioGuard } from './guards/socio.guard';

import { IndexComponent } from './components/index/index.component';
import { UnauthorizedComponent } from './layouts/unauthorized/unauthorized.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginAdminComponent } from './components/admin/login-admin/login-admin.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { GestionSociosComponent } from './components/admin/gestion-socios/gestion-socios.component';
import { GestionProductosComponent } from './components/admin/gestion-productos/gestion-productos.component';
import { GestionPedidosComponent } from './components/admin/gestion-pedidos/gestion-pedidos.component';
import { GestionPagosComponent } from './components/admin/gestion-pagos/gestion-pagos.component';
import { GestionBalanceComponent } from './components/admin/gestion-balance/gestion-balance.component';
import { BuzonComponent } from './components/admin/buzon/buzon.component';
import { GestionEventosComponent } from './components/admin/gestion-eventos/gestion-eventos.component';
import { GestionNoticiasComponent } from './components/admin/gestion-noticias/gestion-noticias.component';
import { GestionCitasComponent } from './components/admin/gestion-citas/gestion-citas.component';
import { GestionVistasComponent } from './components/admin/gestion-vistas/gestion-vistas.component';
import { GestionCursosComponent } from './components/admin/gestion-cursos/gestion-cursos.component';
import { SocioComponent } from './components/admin/forms/socio/socio.component';
import { ProductoComponent } from './components/admin/forms/producto/producto.component';
import { EventoComponent } from './components/admin/forms/evento/evento.component';
import { SociosEventoComponent } from './components/admin/socios-evento/socios-evento.component';
import { NoticiaComponent } from './components/admin/forms/noticia/noticia.component';
import { GestionColaboradoresComponent } from './components/admin/gestion-colaboradores/gestion-colaboradores.component';
import { ColaboradorComponent } from './components/admin/forms/colaborador/colaborador.component';
import { ShowColaboradorComponent } from './components/admin/shows/show-colaborador/show-colaborador.component';
import { ShowNoticiaComponent } from './components/admin/shows/show-noticia/show-noticia.component';
import { ShowProductoComponent } from './components/admin/shows/show-producto/show-producto.component';
import { ShowEventoComponent } from './components/admin/shows/show-evento/show-evento.component';
import { ShowPedidoComponent } from './components/admin/shows/show-pedido/show-pedido.component';
import { ShowPagoComponent } from './components/admin/shows/show-pago/show-pago.component';
import { ShowSugerenciaComponent } from './components/admin/shows/show-sugerencia/show-sugerencia.component';
import { ShowBalanceComponent } from './components/admin/shows/show-balance/show-balance.component';
import { ShowCursoComponent } from './components/admin/shows/show-curso/show-curso.component';
import { ShowAsuntoComponent } from './components/admin/shows/show-asunto/show-asunto.component';
import { ShowStocksComponent } from './components/admin/shows/show-stocks/show-stocks.component';
import { ShowHijosComponent } from './components/admin/shows/show-hijos/show-hijos.component';

import { InfoColegioComponent } from './components/public/info-colegio/info-colegio.component';
import { InfoComedorComponent } from './components/public/info-comedor/info-comedor.component';
import { InfoContactoComponent } from './components/public/info-contacto/info-contacto.component';
import { NoticiasComponent } from './components/public/noticias/noticias.component';
import { EventosComponent } from './components/public/eventos/eventos.component';
import { TiendaComponent } from './components/public/tienda/tienda.component';
import { CarritoComponent } from './components/public/carrito/carrito.component';
import { VistaProductoComponent } from './components/public/vista-producto/vista-producto.component';
import { VentajasComponent } from './components/public/ventajas/ventajas.component';
import { DetallesNoticiaComponent } from './components/public/detalles-noticia/detalles-noticia.component';
import { DetallesEventoComponent } from './components/public/detalles-evento/detalles-evento.component';

import { DatosPersonalesComponent } from './components/miperfil/datos-personales/datos-personales.component';
import { EditarDatosPersonalesComponent } from './components/miperfil/editar-datos-personales/editar-datos-personales.component';
import { EditarPasswordSocioComponent } from './components/miperfil/editar-password-socio/editar-password-socio.component';
import { CitasSocioComponent } from './components/miperfil/citas-socio/citas-socio.component';
import { PagosSocioComponent } from './components/miperfil/pagos-socio/pagos-socio.component';
import { PedidosSocioComponent } from './components/miperfil/pedidos-socio/pedidos-socio.component';
import { BalanceAmpaComponent } from './components/miperfil/balance-ampa/balance-ampa.component';
import { VistaColaboradoresComponent } from './components/miperfil/vista-colaboradores/vista-colaboradores.component';
import { HijosSocioComponent } from './components/miperfil/hijos-socio/hijos-socio.component';
import { CarnetVirtualComponent } from './components/miperfil/carnet-virtual/carnet-virtual.component';

import { SuccessPayComponent } from './layouts/success-pay/success-pay.component';
import { CancelPayComponent } from './layouts/cancel-pay/cancel-pay.component';
import { NotSocioComponent } from './layouts/not-socio/not-socio.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'index', component: IndexComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'not-socio', component: NotSocioComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login-admin', component: LoginAdminComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/socios', component: GestionSociosComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/productos', component: GestionProductosComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/pedidos', component: GestionPedidosComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/pedidos/show/:id', component: ShowPedidoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/pagos', component: GestionPagosComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/pagos/show/:id', component: ShowPagoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/citas', component: GestionCitasComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/citas/show/asunto/:id', component: ShowAsuntoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/eventos', component: GestionEventosComponent, canActivate: [AdminGuard] },
  
  { path: 'gestion/buzon', component: BuzonComponent, canActivate: [AdminGuard] },
  { path: 'gestion/buzon/show/:id', component: ShowSugerenciaComponent, canActivate: [AdminGuard] },
  { path: 'gestion/noticias', component: GestionNoticiasComponent, canActivate: [AdminGuard] },
  { path: 'gestion/balances', component: GestionBalanceComponent, canActivate: [AdminGuard] },
  { path: 'gestion/balances/show/:id', component: ShowBalanceComponent, canActivate: [AdminGuard] },
  { path: 'gestion/cursos', component: GestionCursosComponent, canActivate: [AdminGuard] },
  { path: 'gestion/cursos/show/:id', component: ShowCursoComponent, canActivate: [AdminGuard] },
  { path: 'gestion/vistas', component: GestionVistasComponent, canActivate: [AdminGuard] },
  { path: 'gestion/colaboradores', component: GestionColaboradoresComponent, canActivate: [AdminGuard] },
  
  { path: 'dashboard/socios/form/:id', component: SocioComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/socios/:id/hijos', component: ShowHijosComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/productos/form', component: ProductoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/productos/show/:id', component: ShowProductoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/productos/:id/stocks', component: ShowStocksComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/eventos/form', component: EventoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/eventos/show/:id', component: ShowEventoComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/eventos/:id/socios', component: SociosEventoComponent, canActivate: [AdminGuard] },
  { path: 'gestion/noticias/form', component: NoticiaComponent, canActivate: [AdminGuard] },
  { path: 'gestion/noticias/show/:id', component: ShowNoticiaComponent, canActivate: [AdminGuard] },
  { path: 'gestion/colaboradores/form', component: ColaboradorComponent, canActivate: [AdminGuard] },
  { path: 'gestion/colaboradores/show/:id', component: ShowColaboradorComponent, canActivate: [AdminGuard] },

  { path: 'colegio', component: InfoColegioComponent, canActivate: [] },
  { path: 'comedor', component: InfoComedorComponent, canActivate: [] },
  { path: 'contacto', component: InfoContactoComponent, canActivate: [] },
  { path: 'noticias', component: NoticiasComponent, canActivate: [] },
  { path: 'noticias/:id', component: DetallesNoticiaComponent, canActivate: [] },
  { path: 'tienda', component: TiendaComponent, canActivate: [] },
  { path: 'tienda/producto/:id', component: VistaProductoComponent, canActivate: [] },
  { path: 'carrito', component: CarritoComponent, canActivate: [] },
  { path: 'eventos', component: EventosComponent, canActivate: [] },
  { path: 'eventos/:id', component: DetallesEventoComponent, canActivate: [] },
  { path: 'ventajas', component: VentajasComponent, canActivate: [] },
  
  { path: 'miperfil/datos', component: DatosPersonalesComponent, canActivate: [UsuarioGuard] },
  { path: 'miperfil/datos/editar', component: EditarDatosPersonalesComponent, canActivate: [UsuarioGuard] },
  { path: 'miperfil/datos/editar/contrasenya', component: EditarPasswordSocioComponent, canActivate: [UsuarioGuard] },
  { path: 'miperfil/hijos', component: HijosSocioComponent, canActivate: [SocioGuard] },
  { path: 'miperfil/citas', component: CitasSocioComponent, canActivate: [SocioGuard] },
  { path: 'miperfil/pagos', component: PagosSocioComponent, canActivate: [UsuarioGuard] },
  { path: 'miperfil/pedidos', component: PedidosSocioComponent, canActivate: [UsuarioGuard] },
  { path: 'miperfil/balance-ampa', component: BalanceAmpaComponent, canActivate: [SocioGuard] },
  { path: 'miperfil/colaboradores', component: VistaColaboradoresComponent, canActivate: [SocioGuard] },
  { path: 'miperfil/carnet', component: CarnetVirtualComponent, canActivate: [SocioGuard] },

  { path: 'success', component: SuccessPayComponent, canActivate: [] },
  { path: 'cancel', component: CancelPayComponent, canActivate: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
