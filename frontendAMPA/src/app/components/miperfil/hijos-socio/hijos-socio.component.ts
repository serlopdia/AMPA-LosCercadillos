import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { HijoService } from 'src/app/services/hijo.service';
import { UsersService } from 'src/app/services/users.service';

interface Hijo {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  socio: number;
  clase: number;
  created_at: string;
}
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
interface Clase {
  id: number;
  curso: number;
  letra: string;
  tipo_clase: string;
  curso_escolar: number;
  created_at: string;
}

@Component({
  selector: 'app-hijos-socio',
  templateUrl: './hijos-socio.component.html',
  styleUrls: ['./hijos-socio.component.scss']
})
export class HijosSocioComponent implements OnInit {

  hijoNuevo:any ={
    nombre: null,
    apellidos: null,
    fecha_nacimiento: null,
    clase: null,
  };
  hijosSocio: Hijo[] = [];
  hijo!:Hijo;
  isSuccessful = false;
  errorMessage = '';
  socio!: Socio;
  listaClases: Clase[] = [];

  constructor(private hijoService: HijoService, private cursoService: CursoService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getHijosSocio();
    this.getClasesList();
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

  async getHijosSocio() {
    this.hijoService.getHijosSocioList().subscribe({
      next: (res: Hijo[]) => {
        this.hijosSocio = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  
  crearHijo(): void{
    let hijo = {
      nombre: this.hijoNuevo.nombre,
      apellidos: this.hijoNuevo.apellidos,
      fecha_nacimiento: this.hijoNuevo.fecha_nacimiento,
      socio: this.socio.id,
      clase: this.hijoNuevo.clase,
    }
    this.hijoService.createHijo(hijo).subscribe({
      next: res => {
        this.getHijosSocio();
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
    this.hijoNuevo = {};
  }

  guardarModificaciones(): void {
    this.hijosSocio.forEach(hijo => {
      this.actualizarHijo(hijo);
    });
    document.location.href = "/miperfil/hijos/";
    window.location.href = "/miperfil/hijos/";
  }
  
  actualizarHijo(hijo: Hijo): void{
    let dataEntry = {
      nombre: hijo.nombre,
      apellidos: hijo.apellidos,
      fecha_nacimiento: hijo.fecha_nacimiento,
      socio: hijo.socio,
      clase: hijo.clase,
    }
    this.hijoService.updateHijo(hijo.id.toString(), dataEntry).subscribe({
      next: dataEntry => {

      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarHijo(idHijo: any): void {
    this.hijoService.deleteHijo(idHijo).subscribe({
      next: res => {
        document.location.href = "/miperfil/hijos/";
        window.location.href = "/miperfil/hijos/";
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(idHijo: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este hijo?')) {
      this.eliminarHijo(idHijo);
    }
  }

  async getClasesList() {
    this.cursoService.getClases().subscribe(
      (clases: any[]) => {
        this.listaClases = clases;
      },
      error => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

}
