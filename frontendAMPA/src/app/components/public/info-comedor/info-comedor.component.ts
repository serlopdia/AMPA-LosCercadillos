import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

@Component({
  selector: 'app-info-comedor',
  templateUrl: './info-comedor.component.html',
  styleUrls: ['./info-comedor.component.scss']
})
export class InfoComedorComponent implements OnInit {

  errorMessage = '';
  markdown = '';

  constructor(private vistaService: VistaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getMarkdownComedor();
  }

  getMarkdownComedor(): void {
    this.vistaService.getVistas().subscribe(
      vistas => {
        const vistaComedor = vistas.find((vista: { tipo: string; }) => vista.tipo === 'COMEDOR');
        if (vistaComedor) {
          this.markdown = vistaComedor.markdown;
        } else {
          console.log("No se encontró ninguna vista de 'COMEDOR'.")
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
