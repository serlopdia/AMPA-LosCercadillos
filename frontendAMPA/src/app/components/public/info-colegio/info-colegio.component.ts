import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

@Component({
  selector: 'app-info-colegio',
  templateUrl: './info-colegio.component.html',
  styleUrls: ['./info-colegio.component.scss']
})
export class InfoColegioComponent implements OnInit {

  errorMessage = '';
  markdown = '';

  constructor(private vistaService: VistaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getMarkdownColegio();
  }

  getMarkdownColegio(): void {
    this.vistaService.getVistas().subscribe(
      vistas => {
        const vistaColegio = vistas.find((vista: { tipo: string; }) => vista.tipo === 'COLEGIO');
        if (vistaColegio) {
          this.markdown = vistaColegio.markdown;
        } else {
          console.log("No se encontró ninguna vista de 'COLEGIO'.")
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
