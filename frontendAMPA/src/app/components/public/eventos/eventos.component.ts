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
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  socio!: Socio;
  esSocio = false;
  listaEventos: Evento[] = [];
  eventosFormateados: Evento[] = [];
  errorMessage = ''; 

  constructor(private eventoService: EventoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.isLoggedIn();
    this.isAdmin = this.usersService.isLogAdmin();
    this.getDatosSocio();
    this.formatearEventos();

    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
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

  formatearFecha(evento: Evento) {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(evento.created_at);
    evento.created_at = formatter.format(date);
    return evento;
  }

  getEventosList() {
    this.eventoService.getEventos().subscribe({
      next: res => {
        this.listaEventos = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  formatearEventos() {
    this.eventoService.getEventos().subscribe({
      next: res => {
        res.forEach((evento: Evento) => {
          evento = this.formatearFecha(evento);
        });
        this.eventosFormateados = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  inscribirSocio(idEvento: number) {
    this.eventoService.inscribirSocio(idEvento).subscribe({
      next: res => {
        document.location.href = "/eventos/"+idEvento;
        window.location.href = "/eventos/"+idEvento;
        window.alert("Se ha inscrito al evento correctamente");
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  isSocioInEvento(evento: Evento): boolean {
    return this.socio && evento.socios.some(s => s.id === this.socio.id);
  }

  informarSerAbonado() {
    document.location.href = "/miperfil/pagos";
    window.location.href = "/miperfil/pagos";
    window.alert("Debe pagar la cuota de abonado para poder inscribirse en el evento.");
  }

}
