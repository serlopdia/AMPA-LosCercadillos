import { DatePipe } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import * as XLSX from 'xlsx'; 

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
  deleted: boolean;
}

@Component({
  selector: 'app-gestion-socios',
  templateUrl: './gestion-socios.component.html',
  styleUrls: ['./gestion-socios.component.scss']
})
export class GestionSociosComponent implements OnInit {

  valorBusqueda = '';
  mostrarEliminados = false;
  listaSocios: Socio[] = [];
  sociosFiltrados: Socio[] = [];
  cuotasPagadas: boolean[] = []; // Array para almacenar los valores de cuota_pagada
  fileName = 'lista_usuarios_ampa.xlsx';

  constructor(
    private usersService: UsersService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.getSociosList();
    this.buscar();
  }

  getSociosList() {
    this.usersService.getSociosList().subscribe({
      next: res => {
        this.listaSocios = res;
        this.actualizarCuotasPagadas();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  buscar() {
    if (this.valorBusqueda.trim() !== '') {
      if (this.mostrarEliminados) {
        this.sociosFiltrados = this.listaSocios.filter(socio =>
          socio.first_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
          socio.last_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
          socio.dni.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
          socio.email.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
          socio.tel.toLowerCase().includes(this.valorBusqueda.toLowerCase())
        );
      } else {
        this.sociosFiltrados = this.listaSocios.filter(socio =>
          !socio.deleted &&
          (socio.first_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
            socio.last_name.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
            socio.dni.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
            socio.email.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
            socio.tel.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
        );
      }
    } else {
      this.usersService.getSociosList().subscribe({
        next: res => {
          if (this.mostrarEliminados) {
            this.sociosFiltrados = res;
          } else {
            this.sociosFiltrados = res.filter((socio: { deleted: any; }) => !socio.deleted);
          }
          this.actualizarCuotasPagadas();
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  async actualizarCuotasPagadas() {
    this.cuotasPagadas = []; // Limpiar el array de cuotas pagadas

    for (const socio of this.sociosFiltrados) {
      const cuotaPagada = await this.checkEsSocio(socio.id);
      this.cuotasPagadas.push(cuotaPagada); // Agregar el estado de cuota_pagada al array
    }
  }

  detallesSocio(idSocio: any) {
    window.location.href = '/dashboard/socios?detallesSocio=' + idSocio;
  }

  enviarCorreo() {
    const correos = this.sociosFiltrados.map(socio => socio.email).join(',');
    const enlaceCorreo = `mailto:${correos}`;
    const ancla = this.renderer.createElement('a');
    this.renderer.setAttribute(ancla, 'href', enlaceCorreo);
    ancla.click();
  }

  exportExcel(): void {
    const registros = this.sociosFiltrados.map(socio => {
      const { password, ...datos } = socio;
      return datos;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(registros);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    const fechaActual = this.obtenerFechaActual();
    const nombreArchivo = `RegistrosSocios_${fechaActual}.xlsx`;
  
    XLSX.writeFile(workbook, nombreArchivo);
  }
  
  obtenerFechaActual(): string {
    const datePipe = new DatePipe('en-US');
    const fechaActual = datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    return fechaActual ? fechaActual : '';
  }

  async checkEsSocio(id: number): Promise<boolean> {
    try {
      const esSocio = await this.usersService.checkEsSocioById(id).toPromise();
      return esSocio || false; // Valor predeterminado en caso de que esSocio sea undefined
    } catch (error) {
      console.log(error);
      return false; // Valor predeterminado en caso de error
    }
  }

}
