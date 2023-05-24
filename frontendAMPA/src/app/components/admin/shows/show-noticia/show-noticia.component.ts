import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-show-noticia',
  templateUrl: './show-noticia.component.html',
  styleUrls: ['./show-noticia.component.scss']
})
export class ShowNoticiaComponent implements OnInit {

  form:any ={
    titulo: null,
    cuerpo: null,
    imagen: null,
  }
  noticia!:Noticia;
  isSuccessful = false;
  errorMessage = '';

  constructor(private noticiaService: NoticiaService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosNoticia();
  }
  
  async getDatosNoticia(): Promise<void>{
    let idNoticia = this.route.snapshot.paramMap.get('id');
    this.noticiaService.getNoticia(idNoticia).subscribe({
      next:data=>{
        this.noticia = data as Noticia;
        this.form.titulo = this.noticia.titulo;
        this.form.cuerpo = this.noticia.cuerpo;
        this.form.imagen = this.noticia.imagen;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }
  
  actualizarNoticia(): void{
    let dataEntry = this.form;
    this.noticiaService.updateNoticia(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/gestion/noticias"
        window.location.href = "/gestion/noticias"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarNoticia(): void {
    let idNoticia = this.route.snapshot.paramMap.get('id');
    this.noticiaService.deleteNoticia(idNoticia).subscribe({
      next: res => {
        document.location.href = "/gestion/noticias"
        window.location.href = "/gestion/noticias"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      this.eliminarNoticia();
    }
  }

}
