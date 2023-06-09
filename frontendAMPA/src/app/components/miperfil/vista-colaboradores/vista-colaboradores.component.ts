import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from 'src/app/services/colaborador.service';

interface Colaborador {
  id: number;
  nombre: string;
  ventaja: string;
  descripcion: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-vista-colaboradores',
  templateUrl: './vista-colaboradores.component.html',
  styleUrls: ['./vista-colaboradores.component.scss']
})
export class VistaColaboradoresComponent implements OnInit {

  listaColaboradores: Colaborador[] = [];

  constructor(private colaboradorService: ColaboradorService) { }

  ngOnInit(): void {
    this.getColaboradoresList();
  }

  getColaboradoresList() {
    this.colaboradorService.getColaboradores().subscribe({
      next: res => {
        this.listaColaboradores = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
