import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/global';
import { CursoService } from 'src/app/services/curso.service';
import { PagoCursoService } from 'src/app/services/pago-curso.service';
import { PagoService } from 'src/app/services/pago.service';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}
interface PagoCombinado {
  estado: string;
  cantidad: number;
  tipo: string;
  created_at: string;
}
interface Curso {
  id: number,
  nombre: string;
  precio_cuota: number;
  fecha_inicio: string;
  fecha_fin: string;
  actual: boolean;
  created_at: string;
}

@Component({
  selector: 'app-pagos-socio',
  templateUrl: './pagos-socio.component.html',
  styleUrls: ['./pagos-socio.component.scss']
})
export class PagosSocioComponent implements OnInit {
  
  socio!: Socio;
  listaPagosSocio: PagoCombinado[] = [];
  pagosFormateados: any[] = [];
  cursoActual!: Curso;
  cuotaActualPagada: boolean | undefined;
  stripePromise = loadStripe(environment.stripe_key);
  private paymentHandler: any = null;
  public paymentMessageShown: boolean = false;
  public paymentMessageSuccess: boolean = false;
  public paymentMessageText: string = '';

  constructor(private pagoService: PagoService, private pagoCursoService: PagoCursoService, private cursoService: CursoService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getDatosSocio();
    this.getCursoActual();
    this.combinarPagos();
    this.comprobarCuotaCursoPagada();
  }

  getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  combinarPagos() {
    const listaCombinada: PagoCombinado[] = [];
  
    this.pagoService.getPagosSocioList().subscribe({
      next: res => {
        for (const pago of res) {
          const pagoCombinado: PagoCombinado = {
            cantidad: pago.cantidad,
            estado: pago.estado,
            tipo: "Compra tienda",
            created_at: this.formatearFecha(pago).created_at,
          };
          listaCombinada.push(pagoCombinado);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  
    this.pagoCursoService.getPagosCursoSocioList().subscribe({
      next: res => {
        for (const pago of res) {
          const pagoCombinado: PagoCombinado = {
            cantidad: pago.cantidad,
            estado: pago.estado,
            tipo: "Pago cuota",
            created_at: this.formatearFecha(pago).created_at,
          };
          listaCombinada.push(pagoCombinado);
        }
        listaCombinada.sort((a, b) => b.created_at.localeCompare(a.created_at));
  
        this.pagosFormateados = listaCombinada;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getCursoActual() {
    this.cursoService.getCursos().subscribe({
      next: res => {
        this.cursoActual = res.find((curso: { actual: any }) => curso.actual);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  comprobarCuotaCursoPagada() {
    forkJoin([
      this.pagoCursoService.getPagosCursoSocioList(),
      this.cursoService.getCursos()
    ]).subscribe({
      next: res => {
        const pagosCursoPagados = res[0].filter((pago: { estado: string }) => pago.estado === "PAGADO");
        const cursoActualId = res[1].find((curso: { actual: any }) => curso.actual).id;
  
        this.cuotaActualPagada = pagosCursoPagados.some((pago: { curso_escolar: any }) => pago.curso_escolar === cursoActualId);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  formatearFechaCurso(fecha: string): string {
    const fechaInicio = new Date(fecha);
    const dia = fechaInicio.getDate();
    const mes = fechaInicio.getMonth() + 1; // Los meses en JavaScript se cuentan desde 0
    const año = fechaInicio.getFullYear();
  
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
  
    return `${diaFormateado}/${mesFormateado}/${año}`;
  }

  formatearFecha(pago: PagoCombinado): PagoCombinado {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    const createdAt = pago.created_at;
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = formatter.format(date);
      return {...pago, created_at: formattedDate};
    }
    return pago;
  }

  async pay(): Promise<void> {
    const url = window.location.href;
    const segments = url.split('/');
    const rootUrl = segments[0] + '//' + segments[2];
    const payment = {
      product_name: 'Cuota socio - '+this.cursoActual.nombre,
      price: this.cursoActual.precio_cuota,
      quantity: 1,
      idCurso: this.cursoActual.id,
      idSocio: this.socio.id,
      cancelUrl: rootUrl+'/cancel',
      successUrl: rootUrl+'/success',
    };
    
    (await this.pagoCursoService.createCuotaCheckoutSession(payment)).subscribe({
      next: res => {
        window.location.href = res.url;
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
