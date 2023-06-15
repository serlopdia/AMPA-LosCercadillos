import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { UsersService } from 'src/app/services/users.service';

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

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.scss']
})
export class GestionPedidosComponent implements OnInit {
  
  valorBusqueda = '';
  listaPedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidosFormateados: any[] = [];
  nombresSocios: { [id: number]: string } = {};

  constructor(private pedidoService: PedidoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getPedidosList();
    this.buscar();
    this.formatearPedidos();
    this.nombresSocios = this.usersService.getNombresSocios();
  }

  async getPedidosList() {
    this.pedidoService.getPedidosList().subscribe({
      next: res => {
        this.listaPedidos = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  buscar() {
    if (this.valorBusqueda.trim() !== '') {
      this.pedidosFiltrados = this.pedidosFormateados.filter((pedido) =>
        pedido.email.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        pedido.telefono.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        pedido.pago.toString().toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        pedido.estado.toLowerCase().includes(this.valorBusqueda.toLowerCase())
      );
    } else {
      this.pedidoService.getPedidosList().subscribe({
        next: res => {
          res.forEach((pedido: Pedido) => {
            pedido.created_at = this.formatearFecha(pedido).created_at;
          });
          this.pedidosFiltrados = res;
        },error: err => {
          console.log(err);
        }
      })
    }
  }

  formatearFecha(pedido: Pedido): Pedido {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const createdAt = pedido.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = formatter.format(date);
      return {...pedido, created_at: formattedDate};
    }
    return pedido;
  }

  async formatearPedidos() {
    this.pedidoService.getPedidosList().subscribe({
      next: res => {
        res.forEach((pedido: Pedido) => {
          pedido.created_at = this.formatearFecha(pedido).created_at;
        });
        this.pedidosFormateados = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
