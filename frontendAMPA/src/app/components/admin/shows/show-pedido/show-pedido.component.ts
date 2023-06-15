import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineaPedidoService } from 'src/app/services/linea-pedido.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { StockService } from 'src/app/services/stock.service';

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
interface LineaPedido {
  producto: string;
  stock: string;
  cantidad: number;
  pedido: string;
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
interface Stock {
  id: number;
  cantidad: number;
  nombre: string;
  created_at: string;
}

@Component({
  selector: 'app-show-pedido',
  templateUrl: './show-pedido.component.html',
  styleUrls: ['./show-pedido.component.scss']
})
export class ShowPedidoComponent implements OnInit {

  pedido!: Pedido;
  lineasPedido: LineaPedido[] = [];
  errorMessage = '';

  constructor(private pedidoService: PedidoService, private lineaPedidoService: LineaPedidoService, private productoService: ProductoService, private stockService: StockService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDatosPedido();
    this.getLineasPedidoList();
  }
  
  async getDatosPedido(): Promise<void>{
    let idPedido = this.route.snapshot.paramMap.get('id');
    this.pedidoService.getPedido(idPedido).subscribe({
      next:data=>{
        this.pedido = data as Pedido;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }

  async getDatosProducto(idProducto: string): Promise<Producto> {
    return new Promise<Producto>((resolve, reject) => {
      this.productoService.getProducto(idProducto).subscribe({
        next: data => {
          resolve(data as Producto);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }
  
  async getDatosStock(idStock: string): Promise<Stock> {
    return new Promise<Stock>((resolve, reject) => {
      this.stockService.getStock(idStock).subscribe({
        next: data => {
          resolve(data as Stock);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }
  
  async getLineasPedidoList() {
    let idPedido = this.route.snapshot.paramMap.get('id');
    try {
      const lineasPedidoList: LineaPedido[] = await this.lineaPedidoService.getLineasPedidoList().toPromise();
      this.lineasPedido = lineasPedidoList.filter((linea: LineaPedido) => linea.pedido.toString() === idPedido);
      for (const lp of this.lineasPedido) {
        try {
          const producto: Producto = await this.getDatosProducto(lp.producto);
          const stock: Stock = await this.getDatosStock(lp.stock);
          lp.producto = producto.nombre;
          lp.stock = stock.nombre;
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  formatDate(fechaString: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(fechaString);
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    return `${diaSemana} ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}, ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}h`;
  }
  
  entregarPedido(pedido: Pedido): void {
    let idPedido = this.route.snapshot.paramMap.get('id');
    const dataEntry = {
      ...pedido,
      estado: "ENTREGADO",
    };
  
    this.pedidoService.updatePedido(pedido.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/pedidos/show/"+idPedido;
          window.location.href = "/dashboard/pedidos/show/"+idPedido;
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }
  
  prepararPedido(pedido: Pedido): void {
    let idPedido = this.route.snapshot.paramMap.get('id');
    const dataEntry = {
      ...pedido,
      estado: "PREPARACION",
    };
  
    this.pedidoService.updatePedido(pedido.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/pedidos/show/"+idPedido;
          window.location.href = "/dashboard/pedidos/show/"+idPedido;
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }
  
  devolverPedido(pedido: Pedido): void {
    let idPedido = this.route.snapshot.paramMap.get('id');
    const dataEntry = {
      ...pedido,
      estado: "DEVUELTO",
    };
  
    this.pedidoService.updatePedido(pedido.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/pedidos/show/"+idPedido;
          window.location.href = "/dashboard/pedidos/show/"+idPedido;
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }
  
  cancelarPedido(pedido: Pedido): void {
    let idPedido = this.route.snapshot.paramMap.get('id');
    const dataEntry = {
      ...pedido,
      estado: "CANCELADO",
    };
  
    this.pedidoService.updatePedido(pedido.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/pedidos/show/"+idPedido;
          window.location.href = "/dashboard/pedidos/show/"+idPedido;
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }

}
