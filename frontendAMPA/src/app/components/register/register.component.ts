import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form:any ={
    username: null,
    first_name: null,
    last_name:null,
    password:null,
    password_confirm:null,
    email:null,
    tel:null,
    dni: null,
    address: null,
  }
  
  loginCredentials: any = {
    username: null,
    password: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private usersService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  regForm(): void{
    if(this.form.password == this.form.password_confirm){
      this.usersService.register(this.form).subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          
          // SE PROCEDE A LOGUEAR AL USUARIO
          this.loginCredentials.username = this.form.username;
          this.loginCredentials.password = this.form.password;
          this.usersService.login(this.loginCredentials).subscribe({
            next: data => {
              this.usersService.saveUser(data);
              window.location.href="/miperfil/pagos"
            },
            error: err => {
              let errorMessages = "Registro correcto pero algo falló al iniciar sesión";
              if (err.error && typeof err.error === "object") {
                const errors = Object.values(err.error);
                const messages = errors.flatMap((error: any) => {
                  if (Array.isArray(error)) {
                    return error;
                  } else if (typeof error === "string") {
                    return [error];
                  } else {
                    return [];
                  }
                });
                if (messages.length > 0) {
                  errorMessages = messages.join("\n");
                }
              }
              this.errorMessage = errorMessages;
              this.isSignUpFailed = true;
              window.alert("Error: " + this.errorMessage);
            }
          });
        },
        error: err => {
          let errorMessages = "Error desconocido, el usuario o email pueden estar ya en uso.";
          if (err.error && typeof err.error === "object") {
            const errors = Object.values(err.error);
            const messages = errors.flatMap((error: any) => {
              if (Array.isArray(error)) {
                return error;
              } else if (typeof error === "string") {
                return [error];
              } else {
                return [];
              }
            });
            if (messages.length > 0) {
              errorMessages = messages.join("\n");
            }
            if (err.error.non_field_errors) {
              errorMessages = err.error.non_field_errors[0];
            }
          }
          this.errorMessage = errorMessages;
          this.isSignUpFailed = true;
          window.alert("Error: " + this.errorMessage);
        }
      });
    } else {
      window.alert("Las contraseñas no coinciden");
    }
  }

}
