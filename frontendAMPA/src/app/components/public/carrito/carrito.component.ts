import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Observable, forkJoin, map } from 'rxjs';
import { API_url, environment } from 'src/app/global';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductoService } from 'src/app/services/producto.service';
import { StockService } from 'src/app/services/stock.service';
import { UsersService } from 'src/app/services/users.service';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_general: number;
  precio_socio: number;
  imagen: string;
  created_at: string;
}
interface Stock {
  id: number;
  cantidad: number;
  nombre: string;
  producto: number;
  created_at: string;
}
interface LineaPedidoTemporal {
  producto: string;
  stock: string;
  cantidad: number;
}
interface LineaFormateada {
  imagen: string;
  nombre: string;
  precio: string;
  opcion: string;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  carrito: LineaPedidoTemporal[] = [];
  carritoFormateado: LineaFormateada[] = [];
  precioTotalCarrito = 0;
  producto!:Producto;
  stripePromise = loadStripe(environment.stripe);

  constructor(private http: HttpClient, private carritoService: CarritoService, private productoService: ProductoService, private stockService: StockService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.formatearCarrito();
    this.getPrecioTotalCarrito().subscribe(
      precioTotal => {
        this.precioTotalCarrito = precioTotal;
      }
    );
  }
  
  async getDatosProducto(idProducto: string): Promise<Producto> {
    return new Promise((resolve, reject) => {
      this.productoService.getProducto(idProducto).subscribe({
        next: data => {
          resolve(data as Producto);
        },
        error: err => {
          console.log(err.error.message);
          reject(err);
        }
      });
    });
  }

  async formatearCarrito() {
    for (const lineaPedido of this.carrito) {
      const producto = await this.productoService.getProducto(lineaPedido.producto).toPromise();
      const stock = await this.stockService.getStock(lineaPedido.stock).toPromise();
      let lineaFormateada: LineaFormateada;

      if(!this.usersService.isLoggedIn()) {
        lineaFormateada = {
          imagen: producto.imagen,
          nombre: producto.nombre,
          precio: producto.precio_general,
          opcion: stock.nombre,
          cantidad: lineaPedido.cantidad
        }
      } else {
        lineaFormateada = {
          imagen: producto.imagen,
          nombre: producto.nombre,
          precio: producto.precio_socio,
          opcion: stock.nombre,
          cantidad: lineaPedido.cantidad
        }
      }
  
      this.carritoFormateado.push(lineaFormateada);
    }
  }
  
  getPrecioTotalCarrito(): Observable<number> {
    const observables: Observable<Producto>[] = [];
  
    for (const lineaPedido of this.carrito) {
      const observable = this.productoService.getProducto(lineaPedido.producto);
      observables.push(observable);
    }
  
    return forkJoin(observables).pipe(
      map((productos: Producto[]) => {
        let precioTotal = 0;
  
        for (let i = 0; i < productos.length; i++) {
          const producto = productos[i];
          const lineaPedido = this.carrito[i];
          let precioProducto: number;
          
          if(!this.usersService.isLoggedIn()) {
            precioProducto = producto.precio_general;
          } else {
            precioProducto = producto.precio_socio;
          }
          const cantidad = lineaPedido.cantidad;
  
          precioTotal += precioProducto * cantidad;
        }
  
        return precioTotal;
      })
    );
  }

  eliminarLinea(index: number) {
    this.carrito.splice(index, 1);
    this.carritoService.actualizarCarrito(this.carrito);
    document.location.href = "/carrito";
    window.location.href = "/carrito";
  }

  async pay(): Promise<void> {
    const payment = {
      product_name: 'Iphone',
      price: 99900,
      quantity: 1,
      cancelUrl: '/cancel',
      successUrl: '/success',
    };
    
    (await this.carritoService.createCheckoutSession(payment)).subscribe({
      next: res => {
        window.location.href = res.url;
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
