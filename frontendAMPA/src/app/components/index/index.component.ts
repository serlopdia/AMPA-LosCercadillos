import { Component, OnInit } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  listaNoticias: Noticia[] = [];
  errorMessage = '';
  markdown = '';

  constructor(private vistaService: VistaService, private noticiaService: NoticiaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getMarkdownPrincipal();
    this.getThreeLastNews();
  }

  getMarkdownPrincipal(): void {
    this.vistaService.getVistas().subscribe(
      vistas => {
        const vistaPrincipal = vistas.find((vista: { tipo: string; }) => vista.tipo === 'PRINCIPAL');
        if (vistaPrincipal) {
          this.markdown = vistaPrincipal.markdown;
        } else {
          console.log("No se encontró ninguna vista de 'PRINCIPAL'.")
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  async getThreeLastNews() {
    this.noticiaService.getNoticias().subscribe({
      next: res => {
        res.forEach((noticia: { created_at: string | number | Date; }) => {
          noticia.created_at = new Date(noticia.created_at);
        });
        res.sort((a: { created_at: number; }, b: { created_at: number; }) => b.created_at - a.created_at);
        this.listaNoticias = res.slice(0, 3);
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
