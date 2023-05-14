import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar-gestion',
  templateUrl: './navbar-gestion.component.html',
  styleUrls: ['./navbar-gestion.component.scss']
})
export class NavbarGestionComponent implements OnInit {
  
  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.toggleSidebar();
  }
  
  toggleSidebar() {
    const menuBtn = document.querySelector("#menu-btn");
    const sidebar = document.querySelector("#sidebar");
    const container = document.querySelector(".my-container");
    const navcontainer = document.querySelector(".nav-container");
  
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        sidebar?.classList.toggle("active-nav");
        container?.classList.toggle("active-cont");
        navcontainer?.classList.toggle("active-cont");
      });
    }
  }

  logout(){
    this.userService.logout().subscribe(
      (data) =>{
        localStorage.clear();
        window.location.href="login-admin"
      },
      error =>{
        console.log(error)
      }
    );
  }

}
