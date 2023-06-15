import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-show-balance',
  templateUrl: './show-balance.component.html',
  styleUrls: ['./show-balance.component.scss']
})
export class ShowBalanceComponent implements OnInit {

  form:any ={
    tipo: null,
    asunto: null,
    cantidad: null,
  }
  balance!:Balance;
  isSuccessful = false;
  errorMessage = '';

  constructor(private balanceService: BalanceService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosBalance();
  }
  
  async getDatosBalance(): Promise<void>{
    let idBalance = this.route.snapshot.paramMap.get('id');
    this.balanceService.getBalance(idBalance).subscribe({
      next:data=>{
        this.balance = data as Balance;
        this.form.tipo = this.balance.tipo;
        this.form.asunto = this.balance.asunto;
        this.form.cantidad = this.balance.cantidad;
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
  
  actualizarBalance(): void{
    let dataEntry = this.form;
    this.balanceService.updateBalance(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/gestion/balances"
        window.location.href = "/gestion/balances"
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

}
