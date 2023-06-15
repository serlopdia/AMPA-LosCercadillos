import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
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

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements OnInit {
  
  valorBusqueda = "";
  listaProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosFormateados: any[] = [];

  constructor(private productoService: ProductoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getProductosList();
    this.buscar();
  }

  getProductosList() {
    this.productoService.getProductosList().subscribe({
      next: res => {
        this.listaProductos = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  buscar() {
    if (this.valorBusqueda.trim() !== '') {
      this.productosFiltrados = this.listaProductos.filter((producto) =>
        producto.nombre.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.valorBusqueda.toLowerCase())
      );
    } else {
      this.productoService.getProductosList().subscribe({
        next: res => {
          this.productosFiltrados = res;
        },error: err => {
          console.log(err);
        }
      })
    }
  }

}
