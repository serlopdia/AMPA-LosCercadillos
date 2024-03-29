import { Injectable, Injector } from '@angular/core';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_url, environment } from '../global';
import { loadStripe } from '@stripe/stripe-js';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PagoCursoService {
  
  private usersService?: UsersService | undefined;
  stripePromise = loadStripe(environment.stripe_key);

  constructor(private http: HttpClient, private injector: Injector) { }

  private getUsersService(): UsersService {
    if (!this.usersService) {
      this.usersService = this.injector.get(UsersService);
    }
    return this.usersService;
  }
  
  // DEVUELVE UNA LISTA DE TODOS LOS PAGOS
  getPagosCursoList(): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])

        return this.http.get(`${API_url}/ampa/pagos_curso/`, { headers: headers });
      }
    }
    return new Observable<any>;
  }

  getPagosCursoPorIdSocio(id: number): Observable<any> {
    return this.getPagosCursoList().pipe(
      map(pagos => pagos.filter((pago: { socio: number }) => pago.socio === id))
    );
  }

  // DEVUELVE UNA LISTA DE TODOS LOS PAGOS DEL SOCIO LOGUEADO
  getPagosCursoSocioList(): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])

        return this.http.get(`${API_url}/ampa/pagos_curso/socio/`+res[1], { headers: headers });
      }
    }
    return new Observable<any>;
  }

  createPagoCurso(dataPago:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.post(`${API_url}/ampa/pagos_curso/`, JSON.stringify(dataPago), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  createCuotaCheckoutSession(payment: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${API_url}/ampa/checkout_cuota/`, payment, { headers })
      .pipe(
        map((response: any) => response)
      );
  }

}
