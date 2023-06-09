import { formatDate, registerLocaleData } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { NoticiaService } from 'src/app/services/noticia.service';

interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

  listaNoticias: Noticia[] = [];
  noticiasFormateadas: Noticia[] = [];

  constructor(private noticiaService: NoticiaService, @Inject(LOCALE_ID) private locale: string) {
    registerLocaleData(localeEs);
  }

  ngOnInit(): void {
    this.formatearNoticias();
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
          noticia.created_at = formatDate(noticia.created_at, 'EEEE d MMMM \'de\' yyyy, HH:mm', this.locale);
        });
        this.noticiasFormateadas = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
