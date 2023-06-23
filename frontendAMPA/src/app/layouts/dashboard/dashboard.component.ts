import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.toggleSidebar();
  }
  
  toggleSidebar() {
    const menuBtn = document.querySelector("#menu-btn");
    const sidebar = document.querySelector("#sidebar");
    const container = document.querySelector(".my-container");
    const navcontainer = document.querySelector(".nav-container");
    
    const screenWidth = window.innerWidth;
  
    if (menuBtn && sidebar && container && navcontainer) {
      if (screenWidth >= 700) {
        menuBtn.addEventListener("click", () => {
          sidebar.classList.toggle("active-nav");
          container.classList.toggle("active-cont");
          navcontainer.classList.toggle("active-cont");
        });
      } else {
        sidebar.classList.remove("active-nav");
        container.classList.remove("active-cont");
        navcontainer.classList.remove("active-cont");
        menuBtn.addEventListener("click", () => {
          sidebar.classList.toggle("active-nav");
          container.classList.toggle("active-cont");
          navcontainer.classList.toggle("active-cont");
        });
      }
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
