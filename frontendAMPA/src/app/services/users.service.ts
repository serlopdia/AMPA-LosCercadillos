import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_url } from '../global';
import { map } from 'rxjs';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}

const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  public saveUser(user:any): void{
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser():any {
    const user = localStorage.getItem(USER_KEY);
    if(user) {
      return JSON.parse(user);
    }
    return {};
  }

  public getUserData():Observable<any>{
    if(this.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck!=null){
        var tk = JSON.parse(ck);
        var res = [];
        let isAdmin = false;
        for(var i in tk){
          if(i==='is_staff' && tk[i]){
            isAdmin = true;
          }
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])
        if(isAdmin){
          return this.http.get(API_url + `/users/socios/${res[1]}/`, {'headers':headers})
        }else{
          return this.http.get(API_url + `/users/administradores/${res[1]}/`, {'headers':headers})
        }
      }
    }
    return new Observable<any>;
  }

  login(user:any): Observable<any> {
    return this.http.post(`${API_url}/users/login/`, user, httpOptions);
  }

  public register(user:any): Observable<any>{
    return this.http.post(`${API_url}/users/socios/`, user, httpOptions)
  }

  logout(): Observable<any> {
    if(this.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck!=null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token ' + res[0])

        return this.http.get(`${API_url}/users/logout/`, { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem(USER_KEY);
    if(user) {
      return true;
    }
    return false;
  }

  isLogAdmin(){
    let res = false;
    if(this.isLoggedIn()){
      var ck = localStorage.getItem('auth-user');
      if(ck!=null){
        var tk = JSON.parse(ck);
        for(var i in tk){
          if (i==='administrador id'){
            res = true;
          }
        }
        return res;
      }
    }
    return res;
  }
  
  // DEVUELVE UNA LISTA DE TODOS LOS SOCIOS
  getSociosList(): Observable<any>{
    if(this.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+ res[0])

        return this.http.get(`${API_url}/users/socios/`, { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  getSocioById(id: number): Observable<any> {
    if (this.isLogAdmin()) {
      var ck = localStorage.getItem('auth-user');
      if (ck != null) {
        var tk = JSON.parse(ck);
        var res = [];
        for (var i in tk) {
          res.push(tk[i]);
        }
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Token ' + res[0]);
  
        return this.http.get(`${API_url}/users/socios/${id}/`, { 'headers': headers });
      }
    }
    return new Observable<any>();
  }

  updateSocio(idSocio:any, dataSocio:any): Observable<any>{
    if(this.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.put(`${API_url}/users/socios/${idSocio}/`, JSON.stringify(dataSocio), { 'headers': headers });
      }

    }
    return new Observable<any>;
  }

}
