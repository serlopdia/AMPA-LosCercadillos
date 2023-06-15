import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { UsersService } from './users.service';
import { API_url } from '../global';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  // DEVUELVE UNA LISTA DE TODOS LOS PAGOS
  getPagosList(): Observable<any>{
    if(this.usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])

        return this.http.get(`${API_url}/shop/pagos/`, { headers: headers });
      }
    }
    return new Observable<any>;
  }

  getPago(id: any): Observable<any> {
    if (this.usersService.isLoggedIn()) {
      var ck = localStorage.getItem('auth-user');
      if (ck != null) {
        var tk = JSON.parse(ck);
        var res = [];
        for (var i in tk) {
          res.push(tk[i]);
        }
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Token ' + res[0]);
  
        return this.http.get(`${API_url}/shop/pagos/${id}/`, { 'headers': headers });
      }
    }
    return new Observable<any>();
  }

  // DEVUELVE UNA LISTA DE TODOS LOS PAGOS DEL SOCIO LOGUEADO
  getPagosSocioList(): Observable<any>{
    if(this.usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])

        return this.http.get(`${API_url}/shop/pagos/socio/`+res[1], { headers: headers });
      }
    }
    return new Observable<any>;
  }

}
