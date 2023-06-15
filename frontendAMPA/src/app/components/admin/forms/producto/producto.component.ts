import { Component, OnInit } from '@angular/core';
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
  nombre: number;
  created_at: string;
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  form:any ={
    nombre: null,
    descripcion: null,
    precio_general: null,
    precio_socio: null,
    stock: null,
    nombre_stock: null,
    imagen: null,
  }
  stockNuevo:any ={
    cantidad: null,
    nombre: null,
  };
  listaStocks: any[] = [];
  isSuccessful = false;
  errorMessage = '';

  constructor(private productoService: ProductoService, private stockService: StockService, private usersService: UsersService) { }

  ngOnInit(): void {
  }

  agregarStock(): void {
    if (!this.stockNuevo.nombre || !this.stockNuevo.cantidad) {
      // Mostrar mensaje de error para campos vacíos
      if (!this.stockNuevo.nombre) {
        const nombreElement = document.getElementById('nombre_stockNuevo');
        if (nombreElement) {
          nombreElement.classList.add('is-invalid');
        }
      }
      if (!this.stockNuevo.cantidad) {
        const cantidadElement = document.getElementById('stockNuevo');
        if (cantidadElement) {
          cantidadElement.classList.add('is-invalid');
        }
      }
      return;
    } else if (
      this.stockNuevo.cantidad !== null &&
      this.stockNuevo.cantidad !== undefined &&
      this.stockNuevo.nombre &&
      this.stockNuevo.nombre.trim() !== ''
    ) {
      const stockExistente = this.listaStocks.find(
        (stock) => stock.nombre === this.stockNuevo.nombre
      );
      if (stockExistente) {
        stockExistente.cantidad = this.stockNuevo.cantidad;
      } else {
        this.listaStocks.push(this.stockNuevo);
      }
      this.stockNuevo = { cantidad: null, nombre: '' };
    }
  }

  eliminarStock(index: number): void {
    this.listaStocks.splice(index, 1);
  }
  
  crearProducto(): void {
    let producto = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      precio_general: this.form.precio_general,
      precio_socio: this.form.precio_socio,
      imagen: this.form.imagen,
    }
  
    this.productoService.createProducto(producto).subscribe({
      next: res => {
        for (let s of this.listaStocks) {
          let stock = {
            cantidad: s.cantidad,
            nombre: s.nombre,
            producto: res.id,
          }
          this.stockService.createStock(stock).subscribe({
            next: res => {
              console.log("Stock " + res.id + " creado correctamente");
            },
            error: err => {
              let errorMessages = "Datos erróneos";
              if (err.error && typeof err.error === "object") {
                const errors = Object.entries(err.error);
                const messages = errors.flatMap(([field, error]: [string, any]) => {
                  if (Array.isArray(error)) {
                    return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
                  } else if (typeof error === "string") {
                    return [`${field}: ${error}`];
                  } else {
                    return [];
                  }
                });
                if (messages.length > 0) {
                  errorMessages = messages.join("\n");
                }
              }
            
              this.errorMessage = errorMessages;
              window.alert("Error: " + this.errorMessage);
            }
          });
        }
        document.location.href = "/dashboard/productos";
        window.location.href = "/dashboard/productos";
      },
      error: err => {
          let errorMessages = "Datos erróneos";
          if (err.error && typeof err.error === "object") {
            const errors = Object.entries(err.error);
            const messages = errors.flatMap(([field, error]: [string, any]) => {
              if (Array.isArray(error)) {
                return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
              } else if (typeof error === "string") {
                return [`${field}: ${error}`];
              } else {
                return [];
              }
            });
            if (messages.length > 0) {
              errorMessages = messages.join("\n");
            }
          }
        
          this.errorMessage = errorMessages;
          window.alert("Error: " + this.errorMessage);
        }
    });
  }

}
