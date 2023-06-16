import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  esSocio = false;
  form:any ={
    fecha: null,
    hora: null,
    asunto: null,
  }
  socio!: Socio;
  citasSocio: Cita[] = [];
  listaAsuntos: Asunto[] = [];
  asuntosAbiertos: Asunto[] = [];
  asuntoSeleccionado!: Asunto;
  horasDisponibles: string[] = [];
  fechaMinima: string | undefined;
  isSuccessful = false;
  errorMessage = '';

  constructor(private citaService: CitaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
      if(esSocio) {
        this.getDatosSocio();
        this.getCitasSocioList();
        this.getAsuntosList();
        this.getAsuntosAbiertosList();
      } else {
        document.location.href = "/miperfil/pagos"
        window.location.href = "/miperfil/pagos"
      }
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

  getCitasSocioList() {
    this.citaService.getCitasSocioList().pipe(
      map(res => {
        return res.map((cita: { asunto: any; }) => {
          this.citaService.getAsuntoById(cita.asunto).subscribe({
            next: asunto => {
              cita.asunto = asunto.nombre;
            },
            error: err => {
              console.log(err);
            }
          });
          return cita;
        });
      })).subscribe({
      next: res => {
        this.citasSocio = res;
      },
      error: err => {
        console.log(err);
      }
    });
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
          const fechaMinima = new Date();
          return asunto.visible || (new Date(asunto.fecha_fin + 'T' + asunto.hora_fin) < fechaMinima);
        });
        if (this.asuntosAbiertos.length > 0) {
          this.asuntoSeleccionado = this.asuntosAbiertos[0];
          this.actualizarHorasDisponibles();
          const today = new Date();
          const year = today.getFullYear();
          const month = (today.getMonth() + 1).toString().padStart(2, '0');
          const day = today.getDate().toString().padStart(2, '0');
          this.fechaMinima = `${year}-${month}-${day}`;
          this.getFechaMinima();
        }
      },
      error => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  async actualizarAsuntoSeleccionado(id: string) {
    let asuntoSeleccionado = this.asuntosAbiertos.find(a => a.id.toString() === id);
    if (asuntoSeleccionado) {
      this.asuntoSeleccionado = asuntoSeleccionado;
      this.form = {};
      this.actualizarHorasDisponibles();
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      this.fechaMinima = `${year}-${month}-${day}`;
      this.getFechaMinima();
    }
  }

  actualizarHorasDisponibles(): void {
    let fechaAsunto = {
      asunto_id: this.asuntoSeleccionado.id,
      fecha: this.form.fecha,
    }
    this.horasDisponibles = [];
    if(fechaAsunto.asunto_id && fechaAsunto.fecha) {
      this.citaService.getDisponibilidadDia(fechaAsunto).subscribe({
        next: res => {
          this.horasDisponibles = res;
        },
        error: err => {
          this.errorMessage=err.error.message;
          console.log(err);
        }
      })
    }
  }

  isDisabledDayOfWeek(dayOfWeek: number): boolean {
    const dias_semana = this.asuntoSeleccionado.dias_semana;
    const dias_semana_array = dias_semana.split(',').map(dia => dia.trim().toUpperCase());
    const weekDays = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const selectedDays = dias_semana_array.map(dia => weekDays.indexOf(dia));
  
    return !selectedDays.includes(dayOfWeek);
  }
  
  reservarCita(): void{
    let cita = {
      fecha: this.form.fecha,
      hora: this.form.hora,
      socio: this.socio.id,
      asunto: this.asuntoSeleccionado.id,
    }
    console.log(cita)
    this.citaService.createCita(cita).subscribe({
      next: res => {
        document.location.href = "/miperfil/citas"
        window.location.href = "/miperfil/citas"
        window.alert("Cita reservada correctamente");
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

  getFechaMinima(): string | undefined {
    if (this.asuntoSeleccionado && this.asuntoSeleccionado.fecha_inicio) {
      if (this.fechaMinima) {
        this.fechaMinima = this.fechaMinima > this.asuntoSeleccionado.fecha_inicio ? this.fechaMinima : this.asuntoSeleccionado.fecha_inicio;
      } else {
        this.fechaMinima = this.asuntoSeleccionado.fecha_inicio;
      }
    }
    return this.fechaMinima;
  }

  obtenerNombreAsunto(idAsunto: any): Observable<string> {
    return this.citaService.getAsuntos().pipe(
      map((asuntos: any[]) => {
        this.listaAsuntos = asuntos;
        const asuntoEncontrado = this.listaAsuntos.find(asunto => asunto.id === idAsunto);
        if (asuntoEncontrado) {
          return asuntoEncontrado.nombre;
        } else {
          console.log('No se encontró el asunto con el ID proporcionado');
          return '';
        }
      })
    );
  }
  
}
