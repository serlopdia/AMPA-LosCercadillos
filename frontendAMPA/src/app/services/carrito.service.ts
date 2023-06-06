import { Injectable } from '@angular/core';

interface LineaPedidoTemporal {
  producto: string;
  stock: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  carrito: LineaPedidoTemporal[] = [];

  constructor() { }

  agregarAlCarrito(idProducto: string, idStock: string, cantidadUnidades: number) {
    const lineaPedidoTemporal: LineaPedidoTemporal = {
      producto: idProducto,
      stock: idStock,
      cantidad: cantidadUnidades
    };

    this.carrito.push(lineaPedidoTemporal);
  }

  obtenerCarrito() {
    console.log(this.carrito);
    return this.carrito;
  }

}
