import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;

  constructor(private uService: UsersService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.uService.isLoggedIn();
    this.isAdmin = this.uService.isLogAdmin();
  }

  logout(){
    this.uService.logout().subscribe(
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
