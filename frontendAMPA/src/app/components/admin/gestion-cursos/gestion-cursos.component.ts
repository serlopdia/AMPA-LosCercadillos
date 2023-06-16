import { Component, OnInit } from '@angular/core';
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
interface Clase {
  id: number;
  curso: number;
  letra: string;
  tipo_clase: string;
  curso_escolar: number;
  created_at: string;
}

@Component({
  selector: 'app-gestion-cursos',
  templateUrl: './gestion-cursos.component.html',
  styleUrls: ['./gestion-cursos.component.scss']
})
export class GestionCursosComponent implements OnInit {

  formCurso:any ={
    nombre: null,
    precio_cuota: null,
    fecha_inicio: null,
    fecha_fin: null,
  }
  formClase:any ={
    curso: null,
    letra: null,
    tipo_clase: null,
  }
  isSuccessfulCurso = false;
  isSuccessfulClase = false;
  idCursoSeleccionado = '1';
  cursoSeleccionado: Curso | undefined;
  listaCursos: Curso[] = [];
  clasesCurso: Clase[] = [];
  errorMessage = '';

  constructor(private cursoService: CursoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getCursosList();
    this.onCursoChange(this.idCursoSeleccionado);
  }

  async getCursosList() {
    this.cursoService.getCursos().subscribe(
      (cursos: any[]) => {
        this.listaCursos = cursos.sort((a, b) => {
          const nombreA = a.nombre.toLowerCase();
          const nombreB = b.nombre.toLowerCase();
          if (nombreA < nombreB) {
            return -1;
          }
          if (nombreA > nombreB) {
            return 1;
          }
          return 0;
        });
      },
      error => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }  

  async onCursoChange(cursoId: string) {
    this.cursoService.getCursoById(cursoId).subscribe(
      (curso: Curso) => {
        this.cursoSeleccionado = curso;
      },
      (error) => {
        console.error('Error al obtener el curso:', error);
      }
    );

    this.cursoService.getClases().subscribe((clases: any[]) => {
      const clasesDelCurso = clases.filter(c => c.curso_escolar.toString() === cursoId);
      if (clasesDelCurso) {
        this.clasesCurso = clasesDelCurso.sort((a, b) => {
          if (a.tipo_clase < b.tipo_clase) {
            return -1;
          } else if (a.tipo_clase > b.tipo_clase) {
            return 1;
          }
          
          if (a.curso < b.curso) {
            return -1;
          } else if (a.curso > b.curso) {
            return 1;
          }

          if (a.letra < b.letra) {
            return -1;
          } else if (a.letra > b.letra) {
            return 1;
          }
          return 0;
        });
      } else {
        this.clasesCurso = [];
      }
    });
  }  
  
  crearCurso(): void{
    let curso = {
      nombre: this.formCurso.nombre,
      precio_cuota: this.formCurso.precio_cuota,
      fecha_inicio: this.formCurso.fecha_inicio,
      fecha_fin: this.formCurso.fecha_fin,
      actual: this.formCurso.actual,
    }

    this.cursoService.createCurso(curso).subscribe({
      next: res => {
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
    })
  }
  
  crearClase(): void {
    let clase = {
      curso: this.formClase.curso,
      letra: this.formClase.letra,
      tipo_clase: this.formClase.tipo_clase,
      curso_escolar: this.cursoSeleccionado?.id.toString(),
    };
  
    this.cursoService.createClase(clase).subscribe({
      next: res => {
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
  
    this.formClase = {};
  }
  
  
  eliminarClase(idEntrada: any) {
    this.cursoService.deleteClase(idEntrada).subscribe({
      next: res => {
        document.location.href = "/gestion/cursos"
        window.location.href = "/gestion/cursos"
      },error: err => {
        console.log(err)
      }
    })
  }

  confirmarEliminacionClase(idEntrada: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      this.eliminarClase(idEntrada);
    }
  }
  
  activarCurso(curso: Curso): void {
    const dataEntry = {
      ...curso,
      actual: true,
    };
  
    this.cursoService.updateCurso(curso.id, dataEntry)
      .subscribe({
        next: () => {
          document.location.href = "/gestion/cursos";
          window.location.href = "/gestion/cursos";
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

}