import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}

@Component({
  selector: 'app-editar-datos-personales',
  templateUrl: './editar-datos-personales.component.html',
  styleUrls: ['./editar-datos-personales.component.scss']
})
export class EditarDatosPersonalesComponent implements OnInit {

  form:any ={
    first_name: null,
    last_name:null,
    email:null,
    username: null,
    password: null,
    tel:null,
    dni: null,
    address: null,
  }
  showPassword: boolean = false;
  isSuccessful = false;
  errorMessage = '';

  socio!:Socio;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
  }

  async getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
        this.form.first_name = this.socio.first_name;
        this.form.last_name = this.socio.last_name;
        this.form.email = this.socio.email;
        this.form.username = this.socio.username;
        this.form.password = this.socio.password;
        this.form.tel = this.socio.tel;
        this.form.dni = this.socio.dni;
        this.form.address = this.socio.address;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }
  
  modificarSocio(): void{
    this.usersService.updateSocio(this.socio.id, this.form).subscribe({
      next: dataSocio => {
        document.location.href = "/miperfil/datos"
        window.location.href = "/miperfil/datos"
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

}
