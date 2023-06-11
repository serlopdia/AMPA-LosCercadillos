import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { API_url, environment } from '../global';
import { loadStripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';

interface LineaPedidoTemporal {
  idProducto: string;
  idStock: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  carrito: LineaPedidoTemporal[] = [];
  stripePromise = loadStripe(environment.stripe_key);

  constructor(private http: HttpClient, private usersService: UsersService) {
    const storedCarrito = localStorage.getItem('carrito');
    if (storedCarrito) {
      this.carrito = JSON.parse(storedCarrito);
    }
  }

  agregarAlCarrito(idProducto: string, idStock: string, cantidadUnidades: number) {
    const lineaPedidoTemporal: LineaPedidoTemporal = {
      idProducto: idProducto,
      idStock: idStock,
      cantidad: cantidadUnidades
    };

    this.carrito.push(lineaPedidoTemporal);

    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  obtenerCarrito() {
    return this.carrito;
  }

  actualizarCarrito(carrito: LineaPedidoTemporal[]) {
    this.carrito = carrito;
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  async createCompraCheckoutSession(payment:any): Promise<Observable<any>>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    const stripe = await this.stripePromise;
    
    return this.http.post(`${API_url}/shop/checkout/`, payment, { 'headers': headers });
  }

}
