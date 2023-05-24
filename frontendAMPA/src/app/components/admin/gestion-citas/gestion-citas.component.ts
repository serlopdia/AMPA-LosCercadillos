import { Component, OnInit } from '@angular/core';
import { CitaService } from 'src/app/services/cita.service';
import { UsersService } from 'src/app/services/users.service';

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
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.scss']
})
export class GestionCitasComponent implements OnInit {

  form:any ={
    nombre: null,
    fecha_inicio: null,
    hora_inicio: null,
    fecha_fin: null,
    hora_fin: null,
    minutos_frecuencia: null,
    lunes_checked: null,
    martes_checked: null,
    miercoles_checked: null,
    jueves_checked: null,
    viernes_checked: null,
  }
  isSuccessful = false;
  idAsuntoSeleccionado = '1';
  asuntoSeleccionado: Asunto | undefined;
  listaAsuntos: Asunto[] = [];
  citasAsunto: Cita[] = [];
  nombresSocios: { [id: number]: string } = {};
  errorMessage = '';

  constructor(private citaService: CitaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getAsuntosList();
    this.onAsuntoChange(this.idAsuntoSeleccionado);
    this.nombresSocios = this.usersService.getNombresSocios();
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

  async onAsuntoChange(asuntoId: string) {
    this.citaService.getAsuntoById(asuntoId).subscribe(
    (asunto: Asunto) => {
      this.asuntoSeleccionado = asunto;
    },
    (error) => {
      console.error('Error al obtener el asunto:', error);
    }
  );
    this.citaService.getCitas().subscribe((citas: any[]) => {
      const citasDelAsunto = citas.filter(c => c.asunto.toString() === asuntoId);
      if (citasDelAsunto) {
        this.citasAsunto = citasDelAsunto;
      } else {
        this.citasAsunto = [];
      }
    });
  }
  
  crearAsunto(): void{
    let asunto = {
      nombre: this.form.nombre,
      fecha_inicio: this.form.fecha_inicio,
      hora_inicio: this.form.hora_inicio,
      fecha_fin: this.form.fecha_fin,
      hora_fin: this.form.hora_fin,
      minutos_frecuencia: this.form.minutos_frecuencia,
      dias_semana: this.obtenerDiasSeleccionados(),
    }

    this.citaService.createAsunto(asunto).subscribe({
      next: res => {
        document.location.href = "/dashboard/citas"
        window.location.href = "/dashboard/citas"
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
        document.location.href = "/gestion/citas"
        window.location.href = "/gestion/citas"
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
  
  finalizarAsunto(asunto: Asunto): void {
    const dataEntry = {
      ...asunto,
      visible: false,
    };
  
    this.citaService.updateAsunto(asunto.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/citas";
          window.location.href = "/dashboard/citas";
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }
  
  reanudarAsunto(asunto: Asunto): void {
    const dataEntry = {
      ...asunto,
      visible: true,
    };
  
    this.citaService.updateAsunto(asunto.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/dashboard/citas";
          window.location.href = "/dashboard/citas";
        },
        error: err => {
          this.errorMessage = err.error.message;
          console.log(err);
        }
      });
  }

  obtenerDiasSeleccionados(): string {
    let dias_semana: string[] = [];
    
    if (this.form.lunes_checked) {
      dias_semana.push("LUNES");
    }
    if (this.form.martes_checked) {
      dias_semana.push("MARTES");
    }
    if (this.form.miercoles_checked) {
      dias_semana.push("MIERCOLES");
    }
    if (this.form.jueves_checked) {
      dias_semana.push("JUEVES");
    }
    if (this.form.viernes_checked) {
      dias_semana.push("VIERNES");
    }
    return dias_semana.join(", ");
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
