import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance.service';
import { UsersService } from 'src/app/services/users.service';

interface Balance {
  id: number;
  tipo: string;   // INGRESO o GASTO
  asunto: string;
  cantidad: number;
  created_at: string;
}

@Component({
  selector: 'app-balance-ampa',
  templateUrl: './balance-ampa.component.html',
  styleUrls: ['./balance-ampa.component.scss']
})
export class BalanceAmpaComponent implements OnInit {

  esSocio = false;
  listaCuentas: Balance[] = [];
  errorMessage = '';

  constructor(private balanceService: BalanceService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
      if(esSocio) {
        this.getIngresosGastos();
      } else {
        document.location.href = "/miperfil/pagos"
        window.location.href = "/miperfil/pagos"
      }
    }, error => {
      console.log(error);
    });
  }

  getIngresosGastos() {
    this.balanceService.getIngresosGastos().subscribe({
      next: res => {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        const filteredRes = res.filter((obj: { created_at: string | number | Date; }) => {
          const createdAtDate = new Date(obj.created_at);
          return createdAtDate >= thirtyDaysAgo && createdAtDate <= currentDate;
        });
        this.listaCuentas = filteredRes.sort((a: { created_at: number; }, b: { created_at: number; }) => {
          if (a.created_at > b.created_at) {
            return -1;
          }
          if (a.created_at < b.created_at) {
            return 1;
          }
          return 0;
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getListaCuentasIngreso(): any[] {
    const res = this.listaCuentas.filter(cuenta => cuenta.tipo === 'INGRESO');
    return res.map(balance => this.formatearFecha({...balance}));
  }
  
  getListaCuentasGasto(): any[] {
    const res = this.listaCuentas.filter(cuenta => cuenta.tipo === 'GASTO');
    return res.map(balance => this.formatearFecha({...balance}));
  }

  formatearFecha(balance: Balance): Balance {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

}
