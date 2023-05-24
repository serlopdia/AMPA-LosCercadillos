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
  selector: 'app-gestion-colaboradores',
  templateUrl: './gestion-colaboradores.component.html',
  styleUrls: ['./gestion-colaboradores.component.scss']
})
export class GestionColaboradoresComponent implements OnInit {

  listaColaboradores: Colaborador[] = [];
  colaboradoresFormateados: Colaborador[] = [];

  constructor(private colaboradorService: ColaboradorService) { }

  ngOnInit(): void {
    this.formatearColaboradores();
  }

  formatearFecha(colaborador: Colaborador) {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(colaborador.created_at);
    colaborador.created_at = formatter.format(date);
    return colaborador;
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

  formatearColaboradores() {
    this.colaboradorService.getColaboradores().subscribe({
      next: res => {
        res.forEach((colaborador: Colaborador) => {
          colaborador = this.formatearFecha(colaborador);
        });
        this.colaboradoresFormateados = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
