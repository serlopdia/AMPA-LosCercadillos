import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-show-asunto',
  templateUrl: './show-asunto.component.html',
  styleUrls: ['./show-asunto.component.scss']
})
export class ShowAsuntoComponent implements OnInit {

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
  visible: boolean | undefined;
  asunto!:Asunto;
  isSuccessful = false;
  errorMessage = '';

  constructor(private citaService: CitaService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosAsunto();
  }
  
  async getDatosAsunto(): Promise<void> {
    let idAsunto = this.route.snapshot.paramMap.get('id');
    this.citaService.getAsuntoById(idAsunto).subscribe({
      next: data => {
        this.asunto = data as Asunto;
        this.form.nombre = this.asunto.nombre;
        this.form.fecha_inicio = this.asunto.fecha_inicio;
        this.form.hora_inicio = this.asunto.hora_inicio;
        this.form.fecha_fin = this.asunto.fecha_fin;
        this.form.hora_fin = this.asunto.hora_fin;
        this.form.minutos_frecuencia = this.asunto.minutos_frecuencia;
        this.visible = this.asunto.visible;
  
        const diasSemana = this.asunto.dias_semana.split(', ');
  
        this.form.lunes_checked = diasSemana.includes('LUNES');
        this.form.martes_checked = diasSemana.includes('MARTES');
        this.form.miercoles_checked = diasSemana.includes('MIERCOLES');
        this.form.jueves_checked = diasSemana.includes('JUEVES');
        this.form.viernes_checked = diasSemana.includes('VIERNES');
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }
  
  actualizarAsunto(): void{
    let dataEntry = {
      nombre: this.form.nombre,
      fecha_inicio: this.form.fecha_inicio,
      hora_inicio: this.form.hora_inicio,
      fecha_fin: this.form.fecha_fin,
      hora_fin: this.form.hora_fin,
      minutos_frecuencia: this.form.minutos_frecuencia,
      dias_semana: this.obtenerDiasSeleccionados(),
    }
    this.citaService.updateAsunto(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/dashboard/citas"
        window.location.href = "/dashboard/citas"
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

  eliminarAsunto(): void {
    let idAsunto = this.route.snapshot.paramMap.get('id');
    this.citaService.deleteAsunto(idAsunto).subscribe({
      next: res => {
        document.location.href = "/dashboard/citas"
        window.location.href = "/dashboard/citas"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este asunto de citas?')) {
      this.eliminarAsunto();
    }
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

}
