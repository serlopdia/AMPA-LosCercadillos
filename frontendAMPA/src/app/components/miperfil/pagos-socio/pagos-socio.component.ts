import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago.service';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}
interface Pago {
  id: number;
  estado: string;
  cantidad: number;
  socio: number;
  created_at: string;
}

@Component({
  selector: 'app-pagos-socio',
  templateUrl: './pagos-socio.component.html',
  styleUrls: ['./pagos-socio.component.scss']
})
export class PagosSocioComponent implements OnInit {
  
  socio!: Socio;
  listaPagosSocio: Pago[] = [];
  pagosFormateados: any[] = [];

  constructor(private pagoService: PagoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getPagosSocioList();
    this.formatearPagos();
  }

  getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getPagosSocioList() {
    this.pagoService.getPagosSocioList().subscribe({
      next: res => {
        this.listaPagosSocio = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  formatearFecha(pago: Pago): Pago {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const createdAt = pago.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = formatter.format(date);
      return {...pago, created_at: formattedDate};
    }
    return pago;
  }

  formatearPagos() {
    this.pagoService.getPagosSocioList().subscribe({
      next: res => {
        res.forEach((pago: Pago) => {
          pago.created_at = this.formatearFecha(pago).created_at;
        });
        this.pagosFormateados = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
