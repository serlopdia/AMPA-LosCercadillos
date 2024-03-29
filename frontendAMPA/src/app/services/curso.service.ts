import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { API_url } from '../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  
  private usersService?: UsersService | undefined;

  constructor(private http: HttpClient, private injector: Injector) { }

  private getUsersService(): UsersService {
    if (!this.usersService) {
      this.usersService = this.injector.get(UsersService);
    }
    return this.usersService;
  }
  
  getClases(): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLoggedIn()){
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
    const usersService = this.getUsersService();
    if (usersService.isLoggedIn()) {
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

  createCurso(dataCurso:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.post(`${API_url}/ampa/cursos_escolares/`, JSON.stringify(dataCurso), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  createClase(dataClase:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers = headers.set('Authorization', 'Token ' + res[0]);
        
        return this.http.post(`${API_url}/ampa/clases/`, JSON.stringify(dataClase), { 'headers': headers });
      }
    }
    return new Observable<any>;
  }

  deleteClase(idEntry:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])
        
        return this.http.delete(`${API_url}/ampa/clases/${idEntry}`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }
  
  getCursos(): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])

        return this.http.get(`${API_url}/ampa/cursos_escolares/`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  getCursoById(idCurso:any):Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLoggedIn()){
      var ck = localStorage.getItem('auth-user')
      if(ck!=null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders()
        headers = headers.set('Authorization', 'Token '+res[0])

        return this.http.get(`${API_url}/ampa/cursos_escolares/${idCurso}`, { 'headers': headers })
      }
    }
    return new Observable<any>;
  }

  updateCurso(idEntry:any, dataEntry:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])
        
        return this.http.put(`${API_url}/ampa/cursos_escolares/${idEntry}/`, JSON.stringify(dataEntry), {'headers':headers});
      }
    }
    return new Observable<any>;
  }

  deleteCurso(idEntry:any): Observable<any>{
    const usersService = this.getUsersService();
    if(usersService.isLogAdmin()){
      var ck = localStorage.getItem('auth-user')
      if(ck != null){
        var tk = JSON.parse(ck);
        var res = [];
        for(var i in tk){
          res.push(tk[i]);
        }
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })
        headers=headers.set('Authorization','Token '+res[0])
        
        return this.http.delete(`${API_url}/ampa/cursos_escolares/${idEntry}`, {'headers':headers});
      }
    }
    return new Observable<any>;
  }

}
