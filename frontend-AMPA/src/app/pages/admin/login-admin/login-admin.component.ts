import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  form: any = {
    email: null,
    password: null
  }
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor() { }

  ngOnInit(): void {
  }

  logForm() {
    console.log(this.form);
  }

}
