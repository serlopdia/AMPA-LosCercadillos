import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_url } from '../global';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

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
          return this.http.get(API_url + `users/socios/${res[1]}/`, {'headers':headers})
        }else{
          return this.http.get(API_url + `users/administradores/${res[1]}/`, {'headers':headers})
        }
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

  login(user:any): Observable<any> {
    return this.http.post(API_url + 'users/login/', user, httpOptions);
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

        return this.http.get(API_url + `users/logout/`, {'headers':headers})
      }
    }
    return new Observable<any>;
  }

}
