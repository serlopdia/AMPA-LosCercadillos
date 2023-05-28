import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { VistaService } from 'src/app/services/vista.service';

@Component({
  selector: 'app-info-contacto',
  templateUrl: './info-contacto.component.html',
  styleUrls: ['./info-contacto.component.scss']
})
export class InfoContactoComponent implements OnInit {

  errorMessage = '';
  markdown = '';

  constructor(private vistaService: VistaService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getMarkdownContacto();
  }

  getMarkdownContacto(): void {
    this.vistaService.getVistas().subscribe(
      vistas => {
        const vistaContacto = vistas.find((vista: { tipo: string; }) => vista.tipo === 'CONTACTO');
        if (vistaContacto) {
          this.markdown = vistaContacto.markdown;
        } else {
          console.log("No se encontró ninguna vista de 'CONTACTO'.")
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
