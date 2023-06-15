import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { UsersService } from 'src/app/services/users.service';

interface Curso {
  id: number;
  nombre: string;
  precio_cuota: number;
  fecha_inicio: string;
  fecha_fin: string;
  actual: boolean;
  created_at: string;
}

@Component({
  selector: 'app-show-curso',
  templateUrl: './show-curso.component.html',
  styleUrls: ['./show-curso.component.scss']
})
export class ShowCursoComponent implements OnInit {

  form:any ={
    nombre: null,
    precio_cuota: null,
    fecha_inicio: null,
    fecha_fin: null,
  }
  actual: boolean | undefined;
  curso!:Curso;
  isSuccessful = false;
  errorMessage = '';

  constructor(private citaService: CursoService, private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosCurso();
  }
  
  async getDatosCurso(): Promise<void> {
    let idCurso = this.route.snapshot.paramMap.get('id');
    this.citaService.getCursoById(idCurso).subscribe({
      next: data => {
        this.curso = data as Curso;
        this.form.nombre = this.curso.nombre;
        this.form.precio_cuota = this.curso.precio_cuota;
        this.form.fecha_inicio = this.curso.fecha_inicio;
        this.form.fecha_fin = this.curso.fecha_fin;
        this.actual = this.curso.actual;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }
  
  actualizarCurso(): void{
    let dataEntry = {
      nombre: this.form.nombre,
      fecha_inicio: this.form.fecha_inicio,
      fecha_fin: this.form.fecha_fin,
      precio_cuota: this.form.precio_cuota,
    }
    this.citaService.updateCurso(this.route.snapshot.paramMap.get('id'), dataEntry).subscribe({
      next: dataEntry => {
        document.location.href = "/gestion/cursos"
        window.location.href = "/gestion/cursos"
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

  eliminarCurso(): void {
    let idCurso = this.route.snapshot.paramMap.get('id');
    this.citaService.deleteCurso(idCurso).subscribe({
      next: res => {
        document.location.href = "/gestion/cursos"
        window.location.href = "/gestion/cursos"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacion(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso escolar?')) {
      this.eliminarCurso();
    }
  }

}
