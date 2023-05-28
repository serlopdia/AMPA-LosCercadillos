import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_url } from '../global';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  constructor(private http: HttpClient, private usersService: UsersService) { }
  
  getClases(): Observable<any>{
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

        return this.http.get(`${API_url}/ampa/clases/`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  getClaseById(id: number): Observable<any> {
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
  
        return this.http.get(`${API_url}/ampa/clases/${id}/`, { 'headers': headers });
      }
    }
    return new Observable<any>();
  }

}
