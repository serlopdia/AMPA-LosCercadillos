import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { API_url } from '../global';

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HijoService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  getAllHijos(): Observable<any>{
    if(this.usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])

        return this.http.get(`${API_url}/ampa/hijos/`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  createHijo(dataHijo:any): Observable<any>{
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
        
        return this.http.post(`${API_url}/ampa/hijos/`, JSON.stringify(dataHijo), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  updateHijo(idEntry:any, dataEntry:any): Observable<any>{
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
        
        return this.http.put(`${API_url}/ampa/hijos/${idEntry}/`, JSON.stringify(dataEntry), {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  deleteHijo(idEntry:any): Observable<any>{
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
        
        return this.http.delete(`${API_url}/ampa/hijos/${idEntry}`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

}
