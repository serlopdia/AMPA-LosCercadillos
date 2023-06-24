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
        window.location.href="/miperfil/datos"
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

  reloadPage(): void{
    window.location.href="/miperfil/datos"
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
