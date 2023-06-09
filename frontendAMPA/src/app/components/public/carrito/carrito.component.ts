import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductoService } from 'src/app/services/producto.service';

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

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  carrito: LineaPedidoTemporal[] = [];
  producto!:Producto;

  constructor(private carritoService: CarritoService, private productoService: ProductoService) { }

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
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

}
