import { formatDate, registerLocaleData } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
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
  selector: 'app-detalles-evento',
  templateUrl: './detalles-evento.component.html',
  styleUrls: ['./detalles-evento.component.scss']
})
export class DetallesEventoComponent implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  socio!: Socio;
  evento!:Evento;
  esSocio = false;
  isSuccessful = false;
  errorMessage = '';

  constructor(private eventoService: EventoService, private route: ActivatedRoute, @Inject(LOCALE_ID) private locale: string, private usersService: UsersService) {
    registerLocaleData(localeEs);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.usersService.isLoggedIn();
    this.isAdmin = this.usersService.isLogAdmin();
    this.getDatosSocio();
    this.getDatosEvento();

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
  
  async getDatosEvento(): Promise<void>{
    let idEvento = this.route.snapshot.paramMap.get('id');
    this.eventoService.getEvento(idEvento).subscribe({
      next:data=>{
        this.evento = data as Evento;
        this.evento.descripcion = this.evento.descripcion.replace(/\n/g, '<br>');
        this.evento.created_at = formatDate(this.evento.created_at, 'EEEE d MMMM \'de\' yyyy, HH:mm', this.locale);
      },
      error:err=>{
        console.log(err.error.message);
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

  abandonarEvento(idEvento: number) {
    this.eventoService.abandonarEvento(idEvento).subscribe({
      next: res => {
        document.location.href = "/eventos/"+idEvento;
        window.location.href = "/eventos/"+idEvento;
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
  
  formatFechaFinalizacion(fechaString: string): string {
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const fecha = new Date(fechaString);
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${diaSemana} ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio} a las ${hora}:${minutos}`;
  }

  informarSerAbonado() {
    document.location.href = "/miperfil/pagos";
    window.location.href = "/miperfil/pagos";
    window.alert("Debe pagar la cuota de abonado para poder inscribirse en el evento.");
  }

}

