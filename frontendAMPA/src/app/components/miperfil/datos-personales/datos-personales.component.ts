import { Component, OnInit } from '@angular/core';
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
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

  esSocio = false;
  socio!: Socio;
  hijosSocio: Hijo[] = [];
  hijo!:Hijo;

  constructor(private usersService: UsersService, private hijoService: HijoService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getHijosSocio();

    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
    }, error => {
      console.log(error);
    });
  }

  getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getHijosSocio() {
    this.hijoService.getHijosSocioList().subscribe({
      next: (res: Hijo[]) => {
        this.hijosSocio = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  logoutAndDelete(){
    this.usersService.logout().subscribe(
      (data) =>{
        this.usersService.deleteCuenta(this.socio.id).subscribe({
          next: res => {
            console.log("Cuenta eliminada correctamente.")
          },error: err => {
            console.log(err)
          }
        })
        localStorage.clear();
        window.location.href=""
      },
      error =>{
        console.log(error)
      }
    );
  }

  confirmarEliminacion1(): void {
    if (confirm('Vas a eliminar tu cuenta. ¿Estás seguro/a?')) {
      this.confirmarEliminacion2();
    }
  }

  confirmarEliminacion2(): void {
    if (confirm('Si la eliminas no la podrás recuperar, PERDERÁS EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?')) {
      this.logoutAndDelete();
    }
  }

}
