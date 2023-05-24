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

interface Hijo {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  socio: number;
  clase: number;
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

  socio!:Socio;
  hijosSocio: Hijo[] = [];

  constructor(private route: ActivatedRoute, private usersService: UsersService, private hijoService: HijoService) { }

  ngOnInit(): void {
    this.getSocioData();
    this.getHijosSocio();
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
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  async getHijosSocio() {
    let idSocio = Number(this.route.snapshot.paramMap.get('id'));
    let listaHijos: Hijo[] = [];
    this.hijoService.getAllHijos().subscribe({
      next: (res: Hijo[]) => {
        listaHijos = res.filter(hijo => hijo.socio === idSocio);
        this.hijosSocio = listaHijos;
        console.log(this.hijosSocio);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  tieneHijosAsociados = () =>{
    if (this.hijosSocio){
      return this.hijosSocio.length>0;
    } else{
      return false;
    }
  }

}
