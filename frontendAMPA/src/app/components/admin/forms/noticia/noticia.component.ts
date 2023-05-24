import { Component, OnInit } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';
import { UsersService } from 'src/app/services/users.service';

interface Noticia {
  id: number;
  titulo: string;
  cuerpo: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {

  form:any ={
    titulo: null,
    cuerpo: null,
    imagen: null,
  }
  isSuccessful = false;
  errorMessage = '';

  constructor(private noticiaService: NoticiaService, private usersService: UsersService) { }

  ngOnInit(): void {
  }
  
  crearNoticia(): void{
    this.noticiaService.createNoticia(this.form).subscribe({
      next: res => {
        document.location.href = "/gestion/noticias"
        window.location.href = "/gestion/noticias"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

}
