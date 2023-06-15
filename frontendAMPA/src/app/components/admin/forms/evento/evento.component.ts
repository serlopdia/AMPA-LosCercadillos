import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
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
interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  capacidad: number;
  visible: boolean;
  fin_inscripcion: string;
  socios: Socio[];
  created_at: string;
}

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {

  form:any ={
    titulo: null,
    descripcion: null,
    capacidad: null,
    fin_inscripcion: null,
  }
  isSuccessful = false;
  errorMessage = '';

  constructor(private eventoService: EventoService, private usersService: UsersService) { }

  ngOnInit(): void {
  }
  
  crearEvento(): void{
    this.eventoService.createEvento(this.form).subscribe({
      next: res => {
        document.location.href = "/dashboard/eventos"
        window.location.href = "/dashboard/eventos"
      },
      error: err => {
        let errorMessages = "Datos erróneos";
        if (err.error && typeof err.error === "object") {
          const errors = Object.values(err.error);
          const messages = errors.flatMap((error: any) => {
            if (Array.isArray(error)) {
              return error;
            } else if (typeof error === "string") {
              return [error];
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

}
