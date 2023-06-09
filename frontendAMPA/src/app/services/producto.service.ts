import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_url } from '../global';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  // DEVUELVE UNA LISTA DE TODOS LOS PRODUCTOS
  getProductosList(): Observable<any>{
    let headers = new HttpHeaders()
    return this.http.get(`${API_url}/shop/productos/`, { headers: headers });
  }

  createProducto(dataProducto:any): Observable<any>{
    if(this.usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.post(`${API_url}/shop/productos/`, JSON.stringify(dataProducto), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  updateProducto(idEntry:any, dataEntry:any): Observable<any>{
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
        
        return this.http.put(`${API_url}/shop/productos/${idEntry}/`, JSON.stringify(dataEntry), {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  deleteProducto(idEntry:any): Observable<any>{
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
        
        return this.http.delete(`${API_url}/shop/productos/${idEntry}`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  getProducto(idProducto:any):Observable<any>{
    let headers = new HttpHeaders()
    return this.http.get(`${API_url}/shop/productos/${idProducto}`, { 'headers': headers })
  }

}
