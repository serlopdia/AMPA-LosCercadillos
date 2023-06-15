import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';

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
  selector: 'app-gestion-eventos',
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.scss']
})
export class GestionEventosComponent implements OnInit {

  listaEventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  eventosFormateados: Evento[] = [];
  mapMostrarDescripcionCompleta: Map<number, boolean>;
  valorBusqueda = '';

  constructor(private eventoService: EventoService) {
    this.mapMostrarDescripcionCompleta = new Map();
    this.eventosFormateados.forEach((evento) => {
      this.mapMostrarDescripcionCompleta.set(evento.id, false);
    });
  }

  ngOnInit(): void {
    this.buscar();
    this.formatearEventos();
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

  buscar() {
    if (this.valorBusqueda.trim() !== '') {
      this.eventosFiltrados = this.eventosFormateados.filter((evento) =>
        evento.titulo.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(this.valorBusqueda.toLowerCase())
      );
    } else {
      this.eventoService.getEventos().subscribe({
        next: res => {
          res.forEach((evento: Evento) => {
            evento = this.formatearFecha(evento);
          });
          this.eventosFiltrados = res;
        },error: err => {
          console.log(err);
        }
      })
    }
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

}
