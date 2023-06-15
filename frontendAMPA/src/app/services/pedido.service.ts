import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { API_url } from '../global';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  // DEVUELVE UNA LISTA DE TODOS LOS PEDIDOS
  getPedidosList(): Observable<any>{
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

        return this.http.get(`${API_url}/shop/pedidos/`, { headers: headers });
      }
    }
    return new Observable<any>;
  }

  getPedido(id: any): Observable<any> {
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
  
        return this.http.get(`${API_url}/shop/pedidos/${id}/`, { 'headers': headers });
      }
    }
    return new Observable<any>();
  }

  // DEVUELVE UNA LISTA DE TODOS LOS PEDIDOS DEL SOCIO LOGUEADO
  getPedidosSocioList(): Observable<any>{
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

        return this.http.get(`${API_url}/shop/pedidos/socio/`+res[1], { headers: headers });
      }
    }
    return new Observable<any>;
  }

  createPedido(dataPedido:any): Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.http.post(`${API_url}/shop/pedidos/`, JSON.stringify(dataPedido), { 'headers': headers });
  }

  updatePedido(idEntry:any, dataEntry:any): Observable<any>{
    if(this.usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])
        
        return this.http.put(`${API_url}/shop/pedidos/${idEntry}/`, JSON.stringify(dataEntry), {'headers':headers});
      }
    }
    return new Observable<any>;
  }
  
}
