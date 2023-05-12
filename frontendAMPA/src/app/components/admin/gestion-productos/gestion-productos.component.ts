import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { UsersService } from 'src/app/services/users.service';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_general: number;
  precio_socio: number;
  imagen: number;
  created_at: string;
}

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements OnInit {
  
  listaProductos: Producto[] = [];
  productosFormateados: any[] = [];

  constructor(private productoService: ProductoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getProductosList();
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

}
