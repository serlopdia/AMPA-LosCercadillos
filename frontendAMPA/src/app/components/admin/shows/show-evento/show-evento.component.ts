import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-show-evento',
  templateUrl: './show-evento.component.html',
  styleUrls: ['./show-evento.component.scss']
})
export class ShowEventoComponent implements OnInit {

  form:any ={
    titulo: null,
    descripcion: null,
    capacidad: null,
    fin_inscripcion: null,
  }
  evento!:Evento;
  isSuccessful = false;
  errorMessage = '';

  constructor(private eventoService: EventoService, private route: ActivatedRoute, private datePipe: DatePipe, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosEvento();
  }
  
  async getDatosEvento(): Promise<void>{
    let idEvento = this.route.snapshot.paramMap.get('id');
    this.eventoService.getEvento(idEvento).subscribe({
      next:data=>{
        this.evento = data as Evento;
        this.form.titulo = this.evento.titulo;
        this.form.descripcion = this.evento.descripcion;
        this.form.capacidad = this.evento.capacidad;
        this.form.fin_inscripcion = this.datePipe.transform(this.evento.fin_inscripcion, 'yyyy-MM-ddTHH:mm:ss');
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }
  
  actualizarEvento(): void{
    let dataEntry = this.form;
    this.eventoService.updateEvento(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/dashboard/eventos"
        window.location.href = "/dashboard/eventos"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarEvento(): void {
    let idEvento = this.route.snapshot.paramMap.get('id');
    this.eventoService.deleteEvento(idEvento).subscribe({
      next: res => {
        document.location.href = "/dashboard/eventos"
        window.location.href = "/dashboard/eventos"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.eliminarEvento();
    }
  }

}
