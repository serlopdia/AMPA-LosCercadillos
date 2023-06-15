import { Component, OnInit } from '@angular/core';
import { BuzonService } from 'src/app/services/buzon.service';

interface Sugerencia {
  id: number;
  titulo: string;
  descripcion: string;
  created_at: string;
}

@Component({
  selector: 'app-buzon',
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent implements OnInit {

  listaSugerencias: Sugerencia[] = [];
  sugerenciasFiltradas: Sugerencia[] = [];
  sugerenciasFormateadas: Sugerencia[] = [];
  mapMostrarDescripcionCompleta: Map<number, boolean>;
  valorBusqueda = '';

  constructor(private buzonService: BuzonService) {
    this.mapMostrarDescripcionCompleta = new Map();
    this.sugerenciasFormateadas.forEach((sugerencia) => {
      this.mapMostrarDescripcionCompleta.set(sugerencia.id, false);
    });
  }

  ngOnInit(): void {
    this.buscar();
    this.formatearSugerencias();
  }

  formatearFecha(sugerencia: Sugerencia) {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(sugerencia.created_at);
    sugerencia.created_at = formatter.format(date);
    return sugerencia;
  }

  getSugerenciasList() {
    this.buzonService.getSugerencias().subscribe({
      next: res => {
        this.listaSugerencias = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  buscar() {
    if (this.valorBusqueda.trim() !== '') {
      this.sugerenciasFiltradas = this.sugerenciasFormateadas.filter((sugerencia) =>
        sugerencia.titulo.toLowerCase().includes(this.valorBusqueda.toLowerCase()) ||
        sugerencia.descripcion.toLowerCase().includes(this.valorBusqueda.toLowerCase())
      );
    } else {
      this.buzonService.getSugerencias().subscribe({
        next: res => {
          res.forEach((sugerencia: Sugerencia) => {
            sugerencia = this.formatearFecha(sugerencia);
          });
          this.sugerenciasFiltradas = res;
        },error: err => {
          console.log(err);
        }
      })
    }
  }

  formatearSugerencias() {
    this.buzonService.getSugerencias().subscribe({
      next: res => {
        res.forEach((sugerencia: Sugerencia) => {
          sugerencia = this.formatearFecha(sugerencia);
        });
        this.sugerenciasFormateadas = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
