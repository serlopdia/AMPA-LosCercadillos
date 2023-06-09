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
export class ColaboradorService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  getColaboradores(): Observable<any>{
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

        return this.http.get(`${API_url}/ampa/colaboradores/`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  createColaborador(dataColaborador:any): Observable<any>{
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
        
        return this.http.post(`${API_url}/ampa/colaboradores/`, JSON.stringify(dataColaborador), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  updateColaborador(idEntry:any, dataEntry:any): Observable<any>{
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
        
        return this.http.put(`${API_url}/ampa/colaboradores/${idEntry}/`, JSON.stringify(dataEntry), {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  deleteColaborador(idEntry:any): Observable<any>{
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
        
        return this.http.delete(`${API_url}/ampa/colaboradores/${idEntry}`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  getColaborador(idColaborador:any):Observable<any>{
    if(this.usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck!=null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+res[0])

        return this.http.get(`${API_url}/ampa/colaboradores/${idColaborador}`,{'headers':headers})
      }
    }
    return new Observable<any>;
  }
  
}
