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
  
}