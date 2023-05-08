import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  }
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private uService: UsersService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  logForm() {
    this.uService.login(this.form).subscribe({
      next: data => {
        this.uService.saveUser(data);
        this.isLoggedIn = true;
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
    if(this.esLogAdmin()){
      window.location.href="dashboard";
    }
    else{
      window.location.href="index";
    }
  }

  esLogAdmin(){
    let res = false;
    if(this.uService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user');

      if(ck!=null){
        var tk = JSON.parse(ck);
        for(var i in tk){
          if (i==='administrador id'){
            res = true;
          }
        }
        return res;
      }
    }
    return res;
  }

}
