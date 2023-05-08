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

  constructor(private uService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
    if(this.uService.isLoggedIn() && this.uService.isLogAdmin()) {
      this.isAdminLogged=true;
    }else if(this.uService.isLoggedIn() && !this.uService.isLogAdmin()) {
      this.isSocioLogged=true;
    }
  }

  logForm() {
    this.uService.login(this.form).subscribe({
      next: data => {
        this.uService.saveUser(data);
        if (!this.uService.isLogAdmin()) {
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
    if(this.uService.isLogAdmin()){
      window.location.href="dashboard";
    }
    else{
      window.location.href="";
    }
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
