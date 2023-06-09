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
      },
      error: err => {
        this.errorMessage=err.error.message;
        console.log(err);
      }
    })
  }

}
