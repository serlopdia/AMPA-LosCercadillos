import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { UsersService } from 'src/app/services/users.service';

interface Colaborador {
  id: number;
  nombre: string;
  ventaja: string;
  descripcion: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.scss']
})
export class ColaboradorComponent implements OnInit {

  form:any ={
    nombre: null,
    ventaja: null,
    descripcion: null,
    imagen: null,
  }
  isSuccessful = false;
  errorMessage = '';

  constructor(private colaboradorService: ColaboradorService, private usersService: UsersService) { }

  ngOnInit(): void {
  }
  
  crearColaborador(): void{
    this.colaboradorService.createColaborador(this.form).subscribe({
      next: res => {
        document.location.href = "/gestion/colaboradores"
        window.location.href = "/gestion/colaboradores"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

}
