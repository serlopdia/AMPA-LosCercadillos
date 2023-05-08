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

  constructor(private uService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isLoggedIn = this.uService.isLoggedIn();
    this.isAdmin = this.uService.isLogAdmin();
  }

  logForm(): void{    
    this.uService.login(this.form).subscribe({
      next: data => {
        this.uService.saveUser(data);
        if (this.uService.isLogAdmin()) {
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
    this.uService.logout().subscribe(
      (data) =>{
        localStorage.clear();
      },
      error =>{
        console.log(error)
      }
    );
  }

}
