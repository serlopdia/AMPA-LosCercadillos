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

  createLineaPedido(dataLineaPedido:any): Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    
    return this.http.post(`${API_url}/shop/lineapedidos/`, JSON.stringify(dataLineaPedido), { 'headers': headers });
  }
}
