import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from 'src/app/services/colaborador.service';
import { UsersService } from 'src/app/services/users.service';

interface Colaborador {
  id: number;
  nombre: string;
  ventaja: string;
  descripcion: string;
  imagen: string;
  created_at: string;
}

@Component({
  selector: 'app-vista-colaboradores',
  templateUrl: './vista-colaboradores.component.html',
  styleUrls: ['./vista-colaboradores.component.scss']
})
export class VistaColaboradoresComponent implements OnInit {

  esSocio = false;
  listaColaboradores: Colaborador[] = [];

  constructor(private colaboradorService: ColaboradorService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
      if(esSocio) {
        this.getColaboradoresList();
      } else {
        document.location.href = "/miperfil/pagos"
        window.location.href = "/miperfil/pagos"
      }
    }, error => {
      console.log(error);
    });
  }

  getColaboradoresList() {
    this.colaboradorService.getColaboradores().subscribe({
      next: res => {
        this.listaColaboradores = res;
      },error: err => {
        console.log(err);
      }
    })
  }

}
