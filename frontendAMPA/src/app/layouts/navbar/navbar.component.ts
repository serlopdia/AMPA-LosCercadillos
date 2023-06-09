import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  socio!: Socio;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.isLoggedIn();
    this.isAdmin = this.usersService.isLogAdmin();
    this.getDatosSocio();
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
