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
export class VistaService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  getVistas(): Observable<any>{
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
      return this.http.get(`${API_url}/ampa/vistas/`, {'headers':headers});
  }

  getVistaById(id: number): Observable<any> {
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
  
        return this.http.get(`${API_url}/ampa/vistas/${id}/`, { 'headers': headers });
      }
    }
    return new Observable<any>();
  }

  updateVista(idVista:any, dataVista:any): Observable<any>{
    if(this.usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.put(`${API_url}/ampa/vistas/${idVista}/`, JSON.stringify(dataVista), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

}
