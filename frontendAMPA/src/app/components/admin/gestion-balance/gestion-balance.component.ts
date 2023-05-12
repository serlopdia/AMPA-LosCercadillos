import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance.service';

interface Balance {
  id: number;
  tipo: string;   // INGRESO o GASTO
  asunto: string;
  cantidad: number;
  created_at: string;
}

@Component({
  selector: 'app-gestion-balance',
  templateUrl: './gestion-balance.component.html',
  styleUrls: ['./gestion-balance.component.scss']
})
export class GestionBalanceComponent implements OnInit {

  listaCuentas: Balance[] = [];

  formIngreso:any ={
    tipo: "INGRESO",
    asunto: null,
    cantidad: null,
  }
  formGasto:any ={
    tipo: "GASTO",
    asunto: null,
    cantidad: null
  }
  errorMessage = '';

  constructor(private balanceService: BalanceService) { }

  ngOnInit(): void {
    this.getIngresosGastos();
  }

  getIngresosGastos() {
    this.balanceService.getIngresosGastos().subscribe({
      next: res => {
        this.listaCuentas = res;
      },error: err => {
        console.log(err);
      }
    })
  }

  getListaCuentasIngreso(): any[] {
    const res = this.listaCuentas.filter(cuenta => cuenta.tipo === 'INGRESO');
    return res.map(balance => this.formatearFecha({...balance}));
  }
  
  getListaCuentasGasto(): any[] {
    const res = this.listaCuentas.filter(cuenta => cuenta.tipo === 'GASTO');
    return res.map(balance => this.formatearFecha({...balance}));
  }

  nuevoIngreso(): void{    
    this.balanceService.postEntry(this.formIngreso).subscribe({
      next: data => {
        document.location.href = "/gestion/balance"
        window.location.href = "/gestion/balance"
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }}
    );
  }

  nuevoGasto(): void{    
    this.balanceService.postEntry(this.formGasto).subscribe({
      next: data => {
        document.location.href = "/gestion/balance"
        window.location.href = "/gestion/balance"
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }}
    );
  }

  formatearFecha(balance: Balance): Balance {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const createdAt = balance.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = formatter.format(date);
      return {...balance, created_at: formattedDate};
    }
    return balance;
  }
  
  calcularBalance(): number {
    let total = 0;
  
    this.listaCuentas.forEach(item => {
      if (item.tipo === "INGRESO") {
        total += item.cantidad;
      } else if (item.tipo === "GASTO") {
        total -= item.cantidad;
      }
    });
  
    return total;
  }
  
  eliminarRegistro(idEntrada: any) {
    this.balanceService.deleteEntry(idEntrada).subscribe({
      next: res => {
        document.location.href = "/gestion/balance"
        window.location.href = "/gestion/balance"
      },error: err => {
        console.log(err)
      }
    })
  }

}
