import { Component, OnInit } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';

interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-gestion-noticias',
  templateUrl: './gestion-noticias.component.html',
  styleUrls: ['./gestion-noticias.component.scss']
})
export class GestionNoticiasComponent implements OnInit {

  listaNoticias: Noticia[] = [];
  noticiasFormateadas: Noticia[] = [];
  mapMostrarCuerpoCompleto: Map<number, boolean>;

  constructor(private noticiaService: NoticiaService) {
    this.mapMostrarCuerpoCompleto = new Map();
    this.noticiasFormateadas.forEach((noticia) => {
      this.mapMostrarCuerpoCompleto.set(noticia.id, false);
    });
  }

  ngOnInit(): void {
    this.formatearNoticias();
  }

  formatearFecha(noticia: Noticia) {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(noticia.created_at);
    noticia.created_at = formatter.format(date);
    return noticia;
  }

  async getNoticiasList() {
    this.noticiaService.getNoticias().subscribe({
      next: res => {
        this.listaNoticias = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  formatearNoticias() {
    this.noticiaService.getNoticias().subscribe({
      next: res => {
        res.forEach((noticia: Noticia) => {
          noticia = this.formatearFecha(noticia);
        });
        this.noticiasFormateadas = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
