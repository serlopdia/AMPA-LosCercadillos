import { Component, OnInit } from '@angular/core';
import { BuzonService } from 'src/app/services/buzon.service';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

@Component({
  selector: 'app-info-contacto',
  templateUrl: './info-contacto.component.html',
  styleUrls: ['./info-contacto.component.scss']
})
export class InfoContactoComponent implements OnInit {

  form:any ={
    nombre: null,
    email: null,
    titulo: null,
    descripcion: null,
  }
  isSuccessful = false;
  errorMessage = '';

  constructor(private buzonService: BuzonService, private usersService: UsersService) { }

  ngOnInit(): void {
  }
  
  crearSugerencia(): void{
    this.buzonService.createSugerencia(this.form).subscribe({
      next: res => {
        document.location.href = ""
        window.location.href = ""
        window.alert("Sugerencia mandada correctamente");
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
    })
  }

}
