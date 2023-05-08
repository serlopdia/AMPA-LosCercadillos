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

  constructor(private uService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  regForm(): void{
    if(this.form.password == this.form.password_confirm){
      this.uService.register(this.form).subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          
          // SE PROCEDE A LOGUEAR AL USUARIO
          this.loginCredentials.username = this.form.username;
          this.loginCredentials.password = this.form.password;
          this.uService.login(this.loginCredentials).subscribe({
            next: data => {
              this.uService.saveUser(data);
              this.reloadPage();
            },
            error: err => {
              this.errorMessage = err.error.message;
              this.isLoginFailed = true;
              window.alert("Registro correcto pero algo falló al iniciar sesión.");
            }
          });
        },
        error: err => {
          this.errorMessage=err.error.error;
          this.isSignUpFailed = true;
          console.log(err)
        }
      })
    }
    else{
      var campo = <HTMLElement>document.getElementById("invalid-r")
      campo.style.display = "block";
      campo.style.paddingLeft = "5%";
    }
  }

  reloadPage(): void{
    window.location.href=""
  }

}
