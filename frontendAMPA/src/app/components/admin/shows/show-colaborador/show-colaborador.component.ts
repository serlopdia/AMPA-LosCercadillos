import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-show-colaborador',
  templateUrl: './show-colaborador.component.html',
  styleUrls: ['./show-colaborador.component.scss']
})
export class ShowColaboradorComponent implements OnInit {

  form:any ={
    nombre: null,
    ventaja: null,
    descripcion: null,
    imagen: null,
  }
  colaborador!:Colaborador;
  isSuccessful = false;
  errorMessage = '';

  constructor(private colaboradorService: ColaboradorService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosColaborador();
  }
  
  async getDatosColaborador(): Promise<void>{
    let idColaborador = this.route.snapshot.paramMap.get('id');
    this.colaboradorService.getColaborador(idColaborador).subscribe({
      next:data=>{
        this.colaborador = data as Colaborador;
        this.form.nombre = this.colaborador.nombre;
        this.form.ventaja = this.colaborador.ventaja;
        this.form.descripcion = this.colaborador.descripcion;
        this.form.imagen = this.colaborador.imagen;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }
  
  actualizarColaborador(): void{
    let dataEntry = this.form;
    this.colaboradorService.updateColaborador(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/gestion/colaboradores"
        window.location.href = "/gestion/colaboradores"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

  eliminarColaborador(): void {
    let idColaborador = this.route.snapshot.paramMap.get('id');
    this.colaboradorService.deleteColaborador(idColaborador).subscribe({
      next: res => {
        document.location.href = "/gestion/colaboradores"
        window.location.href = "/gestion/colaboradores"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este colaborador?')) {
      this.eliminarColaborador();
    }
  }

}
