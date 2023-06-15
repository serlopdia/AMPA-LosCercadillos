import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { API_url } from '../global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineaPedidoService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  // DEVUELVE UNA LISTA DE TODAS LAS LÍNEA DE PEDIDOS
  getLineasPedidoList(): Observable<any>{
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

        return this.http.get(`${API_url}/shop/lineapedidos/`, { headers: headers });
      }
    }
    return new Observable<any>;
  }

  createLineaPedido(dataLineaPedido:any): Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.http.post(`${API_url}/shop/lineapedidos/`, JSON.stringify(dataLineaPedido), { 'headers': headers });
  }
}
