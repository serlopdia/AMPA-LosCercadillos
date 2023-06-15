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
          let errorMessages = "Datos erróneos";
          if (err.error && typeof err.error === "object") {
            const errors = Object.entries(err.error);
            const messages = errors.flatMap(([field, error]: [string, any]) => {
              if (Array.isArray(error)) {
                return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
              } else if (typeof error === "string") {
                return [`${field}: ${error}`];
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
