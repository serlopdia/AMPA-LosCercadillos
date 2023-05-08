import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private userService: UsersService) { }

  ngOnInit(): void {

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
