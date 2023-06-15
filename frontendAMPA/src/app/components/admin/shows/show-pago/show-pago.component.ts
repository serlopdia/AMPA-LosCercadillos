import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from 'src/app/services/pago.service';

interface Pago {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  cantidad: number;
  socio: number;
  created_at: string;
}

@Component({
  selector: 'app-show-pago',
  templateUrl: './show-pago.component.html',
  styleUrls: ['./show-pago.component.scss']
})
export class ShowPagoComponent implements OnInit {

  pago!: Pago;

  constructor(private pagoService: PagoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDatosPago();
  }
  
  async getDatosPago(): Promise<void>{
    let idPago = this.route.snapshot.paramMap.get('id');
    this.pagoService.getPago(idPago).subscribe({
      next:data=>{
        this.pago = data as Pago;
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
