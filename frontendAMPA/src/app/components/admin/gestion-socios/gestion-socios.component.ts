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
  selector: 'app-gestion-socios',
  templateUrl: './gestion-socios.component.html',
  styleUrls: ['./gestion-socios.component.scss']
})
export class GestionSociosComponent implements OnInit {
  
  listaSocios: Socio[] = [];
  valorBusqueda = "";

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getSociosList();
    this.buscar();
  }

  getSociosList() {
    this.usersService.getSociosList().subscribe({
      next: res => {
        this.listaSocios = res;
        console.log(res);
      },error: err => {
        console.log(err);
      }
    })
  }

  sociosFiltrados = this.listaSocios;

  buscar() {
    this.sociosFiltrados = this.listaSocios.filter((socio) =>
    socio.first_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
    socio.last_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
    socio.dni.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
    socio.email.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
    socio.tel.toLowerCase().includes(this.valorBusqueda.toLowerCase())
    );
  }
  
  detallesSocio(idSocio: any) {
    window.location.href = '/dashboard/socios?detallesSocio=' + idSocio;
  }

}
