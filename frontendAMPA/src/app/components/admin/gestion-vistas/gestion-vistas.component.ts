import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

interface Vista {
  id: number;
  tipo: string;
  markdown: string;
  created_at: string;
}

@Component({
  selector: 'app-gestion-vistas',
  templateUrl: './gestion-vistas.component.html',
  styleUrls: ['./gestion-vistas.component.scss']
})
export class GestionVistasComponent implements OnInit {

  form:any ={
    id: null,
    tipo: 'PRINCIPAL',
    markdown: null,
  }
  tiposVista: any[] = [];
  isSuccessful = false;
  errorMessage = '';
  markdownOriginal = ''; // Agregar esta línea

  vista!:Vista;

  constructor(private route: ActivatedRoute, private vistaService: VistaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getTipos();
    this.onTipoVistaChange(this.form.tipo)
  }

  async getTipos() {
    this.vistaService.getVistas().subscribe(
      (vistas: any[]) => {
        this.tiposVista = vistas.map(vista => vista.tipo);
        this.markdownOriginal = vistas.find(vista => vista.tipo === this.form.tipo)?.markdown || ''; // Asignar el valor original
      },
      error => {
        this.errorMessage=error.message;
        console.log(error);
      }
    );
  }

  async onTipoVistaChange(tipo: string) {
    this.vistaService.getVistas().subscribe((vistas: any[]) => {
      const vistaSeleccionada = vistas.find(v => v.tipo === tipo);
      if (vistaSeleccionada) {
        this.form.id = vistaSeleccionada.id;
        this.form.tipo = vistaSeleccionada.tipo;
        this.form.markdown = vistaSeleccionada.markdown;
      } else {
        this.form.markdown = '';
      }
    });
  }

  actualizarMarkdown(valor: string) {
    this.form.markdown = valor;
  }
  
  modificarVista(): void{
    let dataEntry = this.form;
    this.vistaService.updateVista(this.form.id, dataEntry).subscribe({
      next: dataVista => {
        document.location.href = "/gestion/vistas"
        window.location.href = "/gestion/vistas"
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
