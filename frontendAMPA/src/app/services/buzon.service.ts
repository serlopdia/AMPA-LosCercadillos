import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_url } from '../global';
import { UsersService } from './users.service';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BuzonService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  getSugerencias(): Observable<any>{
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

        return this.http.get(`${API_url}/ampa/sugerencias/`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  createSugerencia(dataSugerencia:any): Observable<any>{
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post(`${API_url}/ampa/sugerencias/`, JSON.stringify(dataSugerencia), { 'headers': headers });
  }
  
}
