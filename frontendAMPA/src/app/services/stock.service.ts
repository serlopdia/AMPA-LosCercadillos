import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { API_url } from '../global';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient, private usersService: UsersService) { }

  createStock(dataStock:any): Observable<any>{
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
        
        return this.http.post(`${API_url}/shop/stockproductos/`, JSON.stringify(dataStock), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

}
