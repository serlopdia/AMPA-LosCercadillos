import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HijoService } from 'src/app/services/hijo.service';
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
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.scss']
})
export class SocioComponent implements OnInit {

  form:any ={
    username: null,
    first_name: null,
    last_name:null,
    password:null,
    email:null,
    tel:null,
    dni: null,
    address: null,
  }
  showPassword: boolean = false;
  isSuccessful = false;
  errorMessage = '';
  idSocio = this.route.snapshot.paramMap.get('id');

  socio!:Socio;

  constructor(private route: ActivatedRoute, private usersService: UsersService, private hijoService: HijoService) { }

  ngOnInit(): void {
    this.getSocioData();
  }

  togglePasswordVisibility(values:any):void {
    this.showPassword = values.currentTarget.checked;
  }

  async getSocioData() {
    let idSocio = this.route.snapshot.paramMap.get('id');
    if (idSocio !== null) {
      let id = parseInt(idSocio);
      this.usersService.getSocioById(id).subscribe({
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
  }
  
  modificarSocio(): void{
    this.usersService.updateSocio(this.route.snapshot.paramMap.get('id'), this.form).subscribe({
      next: dataSocio => {
        document.location.href = "/dashboard/socios"
        window.location.href = "/dashboard/socios"
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

  deleteSocio(idSocio: number){
    this.usersService.deleteCuenta(idSocio).subscribe({
      next: res => {
        document.location.href = "/dashboard/socios";
        window.location.href = "/dashboard/socios";
        console.log("Cuenta eliminada correctamente.");
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion1(idSocio: number): void {
    if (confirm('Vas a eliminar la cuenta del socio ' + idSocio + '. ¿Estás seguro/a?')) {
      this.confirmarEliminacion2(idSocio);
    }
  }

  confirmarEliminacion2(idSocio: number): void {
    if (confirm('Si la eliminas no se podrá recuperar, PERDERÁ EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?')) {
      this.deleteSocio(idSocio);
    }
  }

}
