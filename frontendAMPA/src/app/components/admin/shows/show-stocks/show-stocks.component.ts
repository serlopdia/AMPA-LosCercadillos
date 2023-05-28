import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { UsersService } from 'src/app/services/users.service';

interface Stock {
  id: number;
  cantidad: number;
  nombre: string;
  producto: number;
  created_at: string;
}

@Component({
  selector: 'app-show-stocks',
  templateUrl: './show-stocks.component.html',
  styleUrls: ['./show-stocks.component.scss']
})
export class ShowStocksComponent implements OnInit {
  
  stockNuevo:any ={
    cantidad: null,
    nombre: null,
  };
  stocksProducto: Stock[] = [];
  stock!:Stock;
  isSuccessful = false;
  errorMessage = '';
  idProducto: any;

  constructor(private stockService: StockService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.idProducto = this.route.snapshot.paramMap.get('id');
    this.getStocksProducto();
  }

  getStocksProducto() {
    let idProducto = this.route.snapshot.paramMap.get('id');
    this.stockService.getStocksList().subscribe({
      next: res => {
        this.stocksProducto = res.filter((stock: Stock) => stock.producto.toString() === idProducto);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  
  crearStock(): void{
    let stock = {
      cantidad: this.stockNuevo.cantidad,
      nombre: this.stockNuevo.nombre,
      producto: this.idProducto,
    }
    let stockExistente = this.stocksProducto.find((stock) => stock.nombre === this.stockNuevo.nombre);
    if (stockExistente == null) {
      this.stockService.createStock(stock).subscribe({
        next: res => {
          this.getStocksProducto();
        },
        error: err => {
          this.errorMessage=err.error.message;
          console.log(err);
        }
      })
    }
    this.stockNuevo = { cantidad: null, nombre: '' };
  }

  guardarModificaciones(): void {
    this.stocksProducto.forEach(stock => {
      this.actualizarStock(stock);
    });
    document.location.href = "/dashboard/productos/show/"+this.idProducto;
    window.location.href = "/dashboard/productos/show/"+this.idProducto;
  }
  
  actualizarStock(stock: Stock): void{
    let dataEntry = {
      nombre: stock.nombre,
      cantidad: stock.cantidad,
      producto: stock.producto,
    }
    this.stockService.updateStock(stock.id.toString(), dataEntry).subscribe({
      next: dataEntry => {
        
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarStock(idStock: any): void {
    this.stockService.deleteStock(idStock).subscribe({
      next: res => {
        document.location.href = "/dashboard/productos/"+this.idProducto+"/stocks";
        window.location.href = "/dashboard/productos/"+this.idProducto+"/stocks";
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(idStock: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este stock?')) {
      this.eliminarStock(idStock);
    }
  }

}
