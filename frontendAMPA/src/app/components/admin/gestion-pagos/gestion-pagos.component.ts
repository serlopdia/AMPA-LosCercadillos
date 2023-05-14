import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, switchMap, of } from 'rxjs';
import { PagoService } from 'src/app/services/pago.service';
import { UsersService } from 'src/app/services/users.service';

interface Pago {
  id: number;
  estado: string;
  cantidad: number;
  socio: number;
  created_at: string;
}

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent implements OnInit {
  
  listaPagos: Pago[] = [];
  pagosFormateados: any[] = [];
  nombresSocios: { [id: number]: string } = {};

  constructor(private pagoService: PagoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getPagosList();
    this.formatearPagos();
  }

  getPagosList() {
    this.pagoService.getPagosList().subscribe({
      next: res => {
        this.listaPagos = res;
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
  
  getNombresPagos(){
    this.listaPagos.forEach((pago: Pago) => {
      this.usersService.getSocioById(pago.socio).subscribe({
        next: data => {
          let nombre = data.first_name + ' ' + data.last_name + ' #' + data.id;
          this.nombresSocios[pago.socio] = nombre;
        },
        error: err => {
          console.log(err);
        }
      })
    })
  }

  formatearPagos() {
    this.pagoService.getPagosList().subscribe({
      next: res => {
        res.forEach((pago: Pago) => {
          pago.created_at = this.formatearFecha(pago).created_at;
        });
        this.pagosFormateados = res;
        this.getNombresPagos();
      },error: err => {
        console.log(err);
      }
    })
  }

}
