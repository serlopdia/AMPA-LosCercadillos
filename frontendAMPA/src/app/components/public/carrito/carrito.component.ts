import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from 'src/app/global';
import { CarritoService } from 'src/app/services/carrito.service';
import { LineaPedidoService } from 'src/app/services/linea-pedido.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { StockService } from 'src/app/services/stock.service';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_general: number;
  precio_socio: number;
  imagen: string;
  created_at: string;
}
interface LineaPedidoTemporal {
  idProducto: string;
  idStock: string;
  cantidad: number;
}
interface LineaFormateada {
  productoId: number;
  imagen: string;
  nombre: string;
  precio: number;
  opcion: string;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  esSocio = false;
  form:any ={
    nombre: null,
    email: null,
    telefono: null,
    observaciones: null,
  }
  carrito: LineaPedidoTemporal[] = [];
  carritoFormateado: LineaFormateada[] = [];
  isSuccessful = false;
  precioTotalCarrito = 0;
  producto!:Producto;
  errorMessage = '';
  socio!: Socio;
  stripePromise = loadStripe(environment.stripe_key);

  constructor(private carritoService: CarritoService, private productoService: ProductoService, private stockService: StockService, private pedidoService: PedidoService, private lineaPedidoService: LineaPedidoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.formatearCarrito();
    this.getPrecioTotalCarrito().subscribe(
      precioTotal => {
        this.precioTotalCarrito = precioTotal;
      }
    );
    this.getDatosSocio();

    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
    }, error => {
      console.log(error);
    });
  }

  getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
      },
      error: err => {
        console.log(err);
      }
    })
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
      const producto = await this.productoService.getProducto(lineaPedido.idProducto).toPromise();
      const stock = await this.stockService.getStock(lineaPedido.idStock).toPromise();
      let lineaFormateada: LineaFormateada;

      if(this.esSocio) {
        lineaFormateada = {
          productoId: producto.id,
          imagen: producto.imagen,
          nombre: producto.nombre,
          precio: producto.precio_socio.toString(),
          opcion: stock.nombre,
          cantidad: lineaPedido.cantidad
        }
      } else {
        lineaFormateada = {
          productoId: producto.id,
          imagen: producto.imagen,
          nombre: producto.nombre,
          precio: producto.precio_general.toString(),
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
      const observable = this.productoService.getProducto(lineaPedido.idProducto);
      observables.push(observable);
    }
  
    return forkJoin(observables).pipe(
      map((productos: Producto[]) => {
        let precioTotal = 0;
  
        for (let i = 0; i < productos.length; i++) {
          const producto = productos[i];
          const lineaPedido = this.carrito[i];
          let precioProducto: number;
          
          if(this.esSocio) {
            precioProducto = producto.precio_socio;
          } else {
            precioProducto = producto.precio_general;
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
    const url = window.location.href;
    const segments = url.split('/');
    const rootUrl = segments[0] + '//' + segments[2];

    let dataPedido = {
      nombre: this.form.nombre,
      email: this.form.email,
      telefono: this.form.telefono,
      estado: 'NO_PAGADO',
      observaciones: this.form.observaciones,
      pago: null,
      socio: this.socio ? this.socio.id : null,
    }

    this.pedidoService.createPedido(dataPedido).subscribe({
      next: async res => {
        for (let lp of this.carrito) {
          let stock = {
            producto: lp.idProducto,
            stock: lp.idStock,
            cantidad: lp.cantidad,
            pedido: res.id,
          }
          this.lineaPedidoService.createLineaPedido(stock).subscribe({
            next: res => {
              console.log("Línea pedido " + res.id + " creada correctamente");
            },
            error: err => {
          let errorMessages = "Datos erróneos";
          if (err.error && typeof err.error === "object") {
            const errors = Object.entries(err.error);
            const messages = errors.flatMap(([field, error]: [string, any]) => {
              if (Array.isArray(error)) {
                return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
              } else if (typeof error === "string") {
                return [`${field}: ${error}`];
              } else {
                return [];
              }
            });
            if (messages.length > 0) {
              errorMessages = messages.join("\n");
            }
          }
        
          this.errorMessage = errorMessages;
          window.alert("Error: " + this.errorMessage);
        }
          });
        }
        
        const payment = {
          product_name: 'Compra en tienda',
          price: this.precioTotalCarrito,
          quantity: 1,
          nombre: res.nombre,
          email: res.email,
          telefono: res.telefono,
          idPedido: res.id,
          idSocio: this.socio ? this.socio.id : null,
          cancelUrl: rootUrl + '/cancel',
          successUrl: rootUrl + '/success',
        };
    
        (await this.carritoService.createCompraCheckoutSession(payment)).subscribe({
          next: (res) => {
            window.location.href = res.url;
          },
          error: err => {
            let errorMessages = "Datos erróneos";
            if (err.error && typeof err.error === "object") {
              const errors = Object.values(err.error);
              const messages = errors.flatMap((error: any) => {
                if (Array.isArray(error)) {
                  return error;
                } else if (typeof error === "string") {
                  return [error];
                } else {
                  return [];
                }
              });
              if (messages.length > 0) {
                errorMessages = messages.join("\n");
              }
            }
      
            this.errorMessage = errorMessages;
            window.alert("Error: " + this.errorMessage);
          }
        });
        
      },
      error: err => {
        let errorMessages = "Datos erróneos";
        if (err.error && typeof err.error === "object") {
          const errors = Object.entries(err.error);
          const messages = errors.flatMap(([field, error]: [string, any]) => {
            if (Array.isArray(error)) {
              return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
            } else if (typeof error === "string") {
              return [`${field}: ${error}`];
            } else {
              return [];
            }
          });
          if (messages.length > 0) {
            errorMessages = messages.join("\n");
          }
        }
      
        this.errorMessage = errorMessages;
        window.alert("Error: " + this.errorMessage);
      }
    });
  }

}
