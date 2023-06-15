import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-vista-producto',
  templateUrl: './vista-producto.component.html',
  styleUrls: ['./vista-producto.component.scss']
})
export class VistaProductoComponent implements OnInit {

  form:any ={
    nombre: null,
    descripcion: null,
    precio_general: null,
    precio_socio: null,
    stock: null,
    nombre_stock: null,
    imagen: null,
  }
  producto!:Producto;
  listaProductos: Producto[] = [];
  stocksProducto: Stock[] = [];
  opcionesProducto: any[] = [];
  opcionSeleccionada = '';
  cantidadUnidades: number = 1;
  isSuccessful = false;
  errorMessage = '';
  idProducto: any;

  constructor(private productoService: ProductoService, private stockService: StockService, private carritoService: CarritoService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.idProducto = this.route.snapshot.paramMap.get('id');
    this.getDatosProducto();
    this.getProductosList();
    this.getStocksProducto();
    this.obtenerStockMaximo();
  }
  
  async getDatosProducto(): Promise<void>{
    let idProducto = this.route.snapshot.paramMap.get('id');
    this.productoService.getProducto(idProducto).subscribe({
      next:data=>{
        this.producto = data as Producto;
        this.form.nombre = this.producto.nombre;
        this.form.descripcion = this.producto.descripcion;
        this.form.precio_general = this.producto.precio_general;
        this.form.precio_socio = this.producto.precio_socio;
        this.form.imagen = this.producto.imagen;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }

  async getProductosList() {
    this.productoService.getProductosList().subscribe({
      next: res => {
        this.listaProductos = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  async getStocksProducto() {
    let idProducto = this.route.snapshot.paramMap.get('id');
    this.stockService.getStocksList().subscribe({
      next: res => {
        this.stocksProducto = res.filter((stock: Stock) => stock.producto.toString() === idProducto);
        this.opcionesProducto = this.stocksProducto.map(stock => stock.nombre);
        if (this.opcionesProducto.length > 0) {
          this.opcionSeleccionada = this.opcionesProducto[0];
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  actualizarOpcionSeleccionada(valor: string) {
    this.opcionSeleccionada = valor;
  }
  
  obtenerStockDisponible(): number {
    const stockSeleccionado = this.stocksProducto.find((stock) => stock.nombre === this.opcionSeleccionada);
    if (stockSeleccionado) {
      const cantidadAgregada = this.obtenerCantidadAgregada(stockSeleccionado.id.toString());
      return stockSeleccionado.cantidad - cantidadAgregada;
    }
    return 0;
  }
  
  obtenerStockMaximo(): number {
    const stockSeleccionado = this.stocksProducto.find((stock) => stock.nombre === this.opcionSeleccionada);
    if (stockSeleccionado) {
      const cantidadAgregada = this.obtenerCantidadAgregada(stockSeleccionado.id.toString());
      const stockDisponible = stockSeleccionado.cantidad - cantidadAgregada;
      const stockRestante = stockDisponible - this.cantidadUnidades - cantidadAgregada;
      return stockRestante >= 0 ? stockRestante : 0;
    }
    return 0;
  }
  
  obtenerCantidadAgregada(idStock: string): number {
    let cantidadAgregada = 0;
    for (const linea of this.carritoService.carrito) {
      if (linea.idStock === idStock) {
        cantidadAgregada += linea.cantidad;
      }
    }
    return cantidadAgregada;
  }

  incrementarCantidad(): void {
    const stockMaximo = this.obtenerStockMaximo();
    if (stockMaximo > 0 && this.cantidadUnidades < stockMaximo) {
      this.cantidadUnidades++;
    } else {
      this.cantidadUnidades = 1;
    }
  }
  
  decrementarCantidad(): void {
    if (this.cantidadUnidades > 0) {
      this.cantidadUnidades--;
    }
  }

  obtenerIdStock(producto: string, nombre: string): string | undefined {
    let stock = this.stocksProducto.find((item) => item.nombre === nombre && item.producto.toString() === producto);
    if (stock) {
      return stock.id.toString();
    }
    return undefined;
  }

  agregarAlCarrito() {
    let idProducto = this.producto.id.toString();
    let idStock = this.obtenerIdStock(idProducto, this.opcionSeleccionada);
    let cantidadUnidades = this.cantidadUnidades;
  
    if (idStock) {
      let stockDisponible = this.stocksProducto.find((stock) => stock.id.toString() === idStock)?.cantidad;
      if (stockDisponible !== undefined && cantidadUnidades > stockDisponible) {
        cantidadUnidades = stockDisponible;
        this.cantidadUnidades = cantidadUnidades;
      }
  
      this.carritoService.agregarAlCarrito(idProducto, idStock, cantidadUnidades);
      this.cantidadUnidades = 0;
    } else {
      console.log('No se encontró opción seleccionada para el producto.');
    }
  }

}
