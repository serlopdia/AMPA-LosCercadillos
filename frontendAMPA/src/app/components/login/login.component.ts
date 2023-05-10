import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  form: any = {
    username: null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  isAdmin = false;
  errorMessage = '';

  constructor(private usersService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.isLoggedIn();
    this.isAdmin = this.usersService.isLogAdmin();
  }

  logForm(): void{    
    this.usersService.login(this.form).subscribe({
      next: data => {
        this.usersService.saveUser(data);
        if (this.usersService.isLogAdmin()) {
          this.errorMessage = "Credenciales incorrectas.";
          this.deleteSession();
          this.isLoginFailed = true;
          return;
        }
        this.isLoggedIn = true;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        window.alert("Credenciales incorrectas");
      }}
    );
  }

  reloadPage(): void{
    window.location.href=""
  }

  deleteSession(){
    this.usersService.logout().subscribe(
      (data) =>{
        localStorage.clear();
      },
      error =>{
        console.log(error)
      }
    );
  }

}
