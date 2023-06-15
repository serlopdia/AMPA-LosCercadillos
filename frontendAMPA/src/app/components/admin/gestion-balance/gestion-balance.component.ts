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
        // Ordenar por created_at de forma descendente
        this.listaCuentas = res.sort((a: { created_at: number; }, b: { created_at: number; }) => {
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

  nuevoIngreso(): void{    
    this.balanceService.postEntry(this.formIngreso).subscribe({
      next: data => {
        document.location.href = "/gestion/balances"
        window.location.href = "/gestion/balances"
      },
      error: err => {
          let errorMessages = "Datos erróneos";
          if (err.error && typeof err.error === "object") {
            const errors = Object.entries(err.error);
            const messages = errors.flatMap(([field, error]: [string, any]) => {
              if (Array.isArray(error)) {
                return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
              } else if (typeof error === "string") {
                return [`${field}: ${error}`];
              } else {
                return [];
              }
            });
            if (messages.length > 0) {
              errorMessages = messages.join("\n");
            }
          }
        
          this.errorMessage = errorMessages;
          window.alert("Error: " + this.errorMessage);
        }
    });
  }

  nuevoGasto(): void{    
    this.balanceService.postEntry(this.formGasto).subscribe({
      next: data => {
        document.location.href = "/gestion/balances"
        window.location.href = "/gestion/balances"
      },
      error: err => {
        let errorMessages = "Datos erróneos";
        if (err.error && typeof err.error === "object") {
          const errors = Object.entries(err.error);
          const messages = errors.flatMap(([field, error]: [string, any]) => {
            if (Array.isArray(error)) {
              return error.map((errorMsg: string) => `${field}: ${errorMsg}`);
            } else if (typeof error === "string") {
              return [`${field}: ${error}`];
            } else {
              return [];
            }
          });
          if (messages.length > 0) {
            errorMessages = messages.join("\n");
          }
        }
      
        this.errorMessage = errorMessages;
        window.alert("Error: " + this.errorMessage);
      }
    });
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
  
  eliminarBalance(idEntrada: any) {
    this.balanceService.deleteBalance(idEntrada).subscribe({
      next: res => {
        document.location.href = "/gestion/balances"
        window.location.href = "/gestion/balances"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(idEntrada: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este balance?')) {
      this.eliminarBalance(idEntrada);
    }
  }

}
