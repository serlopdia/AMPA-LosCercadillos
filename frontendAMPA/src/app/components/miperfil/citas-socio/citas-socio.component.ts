import { Component, OnInit } from '@angular/core';
import { CitaService } from 'src/app/services/cita.service';
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
interface Asunto {
  id: number;
  nombre: string;
  fecha_inicio: string;
  hora_inicio: string;
  fecha_fin: string;
  hora_fin: string;
  minutos_frecuencia: number;
  dias_semana: string;
  visible: boolean;
  created_at: string;
}
interface Cita {
  id: number;
  fecha: string;
  hora: string;
  socio: number;
  asunto: number;
  created_at: string;
}

@Component({
  selector: 'app-citas-socio',
  templateUrl: './citas-socio.component.html',
  styleUrls: ['./citas-socio.component.scss']
})
export class CitasSocioComponent implements OnInit {

  form:any ={
    fecha: null,
    hora: null,
    asunto: null,
  }
  socio!: Socio;
  citasSocio: Cita[] = [];
  listaAsuntos: Asunto[] = [];
  asuntosAbiertos: Asunto[] = [];
  asuntoSeleccionado = '';
  isSuccessful = false;
  errorMessage = '';

  constructor(private citaService: CitaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getCitasSocioList();
    this.getAsuntosList();
    this.getAsuntosAbiertosList();
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

  getCitasSocioList() {
    this.citaService.getCitasSocioList().subscribe({
      next: res => {
        this.citasSocio = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  async getAsuntosList() {
    this.citaService.getAsuntos().subscribe(
      (asuntos: any[]) => {
        this.listaAsuntos = asuntos;
      },
      error => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  async getAsuntosAbiertosList() {
    this.citaService.getAsuntos().subscribe(
      (asuntos: any[]) => {
        this.asuntosAbiertos = asuntos.filter(asunto => {
          const fechaActual = new Date();
          return asunto.visible || (new Date(asunto.fecha_fin + 'T' + asunto.hora_fin) < fechaActual);
        });
        if (this.asuntosAbiertos.length > 0) {
          this.asuntoSeleccionado = this.asuntosAbiertos[0].id.toString();
        }
      },
      error => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  actualizarAsuntoSeleccionado(valor: string) {
    this.asuntoSeleccionado = valor;
  }
  
  reservarCita(): void{
    let cita = {
      fecha: this.form.fecha,
      hora: this.form.hora,
      socio: this.socio.id,
      asunto: this.asuntoSeleccionado,
    }
    this.citaService.createCita(cita).subscribe({
      next: res => {
        document.location.href = "/miperfil/citas"
        window.location.href = "/miperfil/citas"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }
  
  eliminarCita(idEntrada: any) {
    this.citaService.deleteCita(idEntrada).subscribe({
      next: res => {
        document.location.href = "/miperfil/citas"
        window.location.href = "/miperfil/citas"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacionCita(idEntrada: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.eliminarCita(idEntrada);
    }
  }
  
  formatDate(fechaString: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(fechaString);
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    return `${diaSemana}, ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
  }

  formatTime(hora: string): string {
    const horaObjeto = new Date(`2000-01-01T${hora}`);
    const horas = horaObjeto.getHours().toString().padStart(2, '0');
    const minutos = horaObjeto.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

}
