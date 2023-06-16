import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuzonService } from 'src/app/services/buzon.service';

interface Sugerencia {
  id: number;
  nombre: string;
  email: string;
  titulo: string;
  descripcion: string;
  created_at: string;
}

@Component({
  selector: 'app-show-sugerencia',
  templateUrl: './show-sugerencia.component.html',
  styleUrls: ['./show-sugerencia.component.scss']
})
export class ShowSugerenciaComponent implements OnInit {

  sugerencia!: Sugerencia;

  constructor(private buzonService: BuzonService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDatosSugerencia();
  }
  
  async getDatosSugerencia(): Promise<void>{
    let idSugerencia = this.route.snapshot.paramMap.get('id');
    this.buzonService.getSugerencia(idSugerencia).subscribe({
      next:data=>{
        this.sugerencia = data as Sugerencia;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }

  formatDate(fechaString: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(fechaString);
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
    return `${diaSemana} ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}, ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}h`;
  }  

}
