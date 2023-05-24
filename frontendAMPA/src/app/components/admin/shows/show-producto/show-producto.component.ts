import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
interface Stock {
  id: number;
  cantidad: number;
  nombre: number;
  created_at: string;
}

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.scss']
})
export class ShowProductoComponent implements OnInit {

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
  isSuccessful = false;
  errorMessage = '';

  constructor(private productoService: ProductoService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosProducto();
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
  
  actualizarProducto(): void{
    let dataEntry = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      precio_general: this.form.precio_general,
      precio_socio: this.form.precio_socio,
      imagen: this.form.imagen,
    }
    this.productoService.updateProducto(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/dashboard/productos"
        window.location.href = "/dashboard/productos"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarProducto(): void {
    let idProducto = this.route.snapshot.paramMap.get('id');
    this.productoService.deleteProducto(idProducto).subscribe({
      next: res => {
        document.location.href = "/dashboard/productos"
        window.location.href = "/dashboard/productos"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.eliminarProducto();
    }
  }

}
