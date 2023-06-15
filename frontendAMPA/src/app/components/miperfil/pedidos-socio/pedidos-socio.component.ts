import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
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
interface Pedido {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  observaciones: string;
  pago: number;
  socio: number;
  created_at: string;
}
interface Curso {
  id: number,
  nombre: string;
  precio_cuota: number;
  fecha_inicio: string;
  fecha_fin: string;
  actual: boolean;
  created_at: string;
}

@Component({
  selector: 'app-pedidos-socio',
  templateUrl: './pedidos-socio.component.html',
  styleUrls: ['./pedidos-socio.component.scss']
})
export class PedidosSocioComponent implements OnInit {
  
  socio!: Socio;
  listaPedidosSocio: Pedido[] = [];

  constructor(private pedidoService: PedidoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getPedidosSocioList();
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

  getPedidosSocioList() {  
    this.pedidoService.getPedidosSocioList().subscribe({
      next: res => {
        res.forEach((pedido: Pedido) => {
          pedido.created_at = this.formatearFecha(pedido).created_at;
        });
        this.listaPedidosSocio = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  formatearFecha(pago: Pedido): Pedido {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const createdAt = pago.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = formatter.format(date);
      return {...pago, created_at: formattedDate};
    }
    return pago;
  }

}
