import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

@Component({
  selector: 'app-ventajas',
  templateUrl: './ventajas.component.html',
  styleUrls: ['./ventajas.component.scss']
})
export class VentajasComponent implements OnInit {

  errorMessage = '';
  markdown = '';

  constructor(private vistaService: VistaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getMarkdownComedor();
  }

  getMarkdownComedor(): void {
    this.vistaService.getVistas().subscribe(
      vistas => {
        const vistaVentajas = vistas.find((vista: { tipo: string; }) => vista.tipo === 'VENTAJAS');
        if (vistaVentajas) {
          this.markdown = vistaVentajas.markdown;
        } else {
          console.log("No se encontró ninguna vista de 'VENTAJAS'.")
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
