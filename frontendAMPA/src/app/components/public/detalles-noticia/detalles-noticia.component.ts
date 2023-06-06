import { formatDate, registerLocaleData } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService } from 'src/app/services/noticia.service';

interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-detalles-noticia',
  templateUrl: './detalles-noticia.component.html',
  styleUrls: ['./detalles-noticia.component.scss']
})
export class DetallesNoticiaComponent implements OnInit {

  noticia!:Noticia;
  isSuccessful = false;
  errorMessage = '';

  constructor(private noticiaService: NoticiaService, private route: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) {
    registerLocaleData(localeEs);
  }

  ngOnInit(): void {
    this.getDatosNoticia();
  }
  
  async getDatosNoticia(): Promise<void>{
    let idNoticia = this.route.snapshot.paramMap.get('id');
    this.noticiaService.getNoticia(idNoticia).subscribe({
      next:data=>{
        this.noticia = data as Noticia;
        this.noticia.cuerpo = this.noticia.cuerpo.replace(/\n/g, '<br>');
        this.noticia.created_at = formatDate(this.noticia.created_at, 'EEEE d MMMM \'de\' yyyy, HH:mm', this.locale);
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }

}
