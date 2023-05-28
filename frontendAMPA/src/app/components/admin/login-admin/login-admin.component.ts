import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  }

  isAdminLogged = false;
  isSocioLogged = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private usersService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
    if(this.usersService.isLoggedIn() && this.usersService.isLogAdmin()) {
      this.isAdminLogged=true;
    }else if(this.usersService.isLoggedIn() && !this.usersService.isLogAdmin()) {
      this.isSocioLogged=true;
    }
  }

  logForm() {
    this.usersService.login(this.form).subscribe({
      next: data => {
        this.usersService.saveUser(data);
        if (!this.usersService.isLogAdmin()) {
          this.errorMessage = "Credenciales incorrectas.";
          this.deleteSession();
          this.isLoginFailed = true;
          return;
        }
        this.isAdminLogged = true;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        console.log(this.form);
    }}
    );
  }

  reloadPage():void{
    if(this.usersService.isLogAdmin()){
      window.location.href="gestion/buzon";
    }
    else{
      window.location.href="";
    }
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
