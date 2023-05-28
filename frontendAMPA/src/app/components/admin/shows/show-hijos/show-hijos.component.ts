import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaseService } from 'src/app/services/clase.service';
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

interface Clase {
  id: number;
  curso: number;
  letra: string;
  tipo_clase: string;
  curso_escolar: number;
  created_at: string;
}

@Component({
  selector: 'app-show-hijos',
  templateUrl: './show-hijos.component.html',
  styleUrls: ['./show-hijos.component.scss']
})
export class ShowHijosComponent implements OnInit {

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
  idSocio: any;
  listaClases: Clase[] = [];

  constructor(private hijoService: HijoService, private claseService: ClaseService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.idSocio = this.route.snapshot.paramMap.get('id');
    this.getHijosSocio();
    this.getClasesList();
  }

  async getHijosSocio() {
    let idSocio = Number(this.route.snapshot.paramMap.get('id'));
    let listaHijos: Hijo[] = [];
    this.hijoService.getAllHijos().subscribe({
      next: (res: Hijo[]) => {
        listaHijos = res.filter(hijo => hijo.socio === idSocio);
        this.hijosSocio = listaHijos;
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
      socio: this.idSocio,
      clase: this.hijoNuevo.clase,
    }
    console.log(hijo)
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
    document.location.href = "/dashboard/socios/form/"+this.idSocio;
    window.location.href = "/dashboard/socios/form/"+this.idSocio;
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
        document.location.href = "/dashboard/socios/"+this.idSocio+"/hijos";
        window.location.href = "/dashboard/socios/"+this.idSocio+"/hijos";
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
    this.claseService.getClases().subscribe(
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
