import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
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
interface LineaPedidoTemporal {
  producto: string;
  stock: string;
  cantidad: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  socio!: Socio;
  carrito: LineaPedidoTemporal[] = [];

  constructor(private usersService: UsersService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.isLoggedIn();
    this.isAdmin = this.usersService.isLogAdmin();
    this.getDatosSocio();
    this.carrito = this.carritoService.obtenerCarrito();
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

  logout(){
    this.usersService.logout().subscribe(
      (data) =>{
        localStorage.clear();
        window.location.href=""
      },
      error =>{
        console.log(error)
      }
    );
  }

}
