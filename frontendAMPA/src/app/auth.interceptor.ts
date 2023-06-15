import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private usersService: UsersService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar si existe el elemento 'auth-user' en el localStorage
    const authUser = localStorage.getItem('auth-user');
    const authToken = authUser ? JSON.parse(authUser).token : null;
    
    if (authToken) {
      // Clonar la solicitud y agregar el encabezado de autorización con el token
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Token ${authToken}`
        }
      });
      
      // Continuar con la solicitud clonada
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.logoutAndRedirectToLogin();
          }
          return throwError(error);
        })
      );
    }
  
    return next.handle(request);
  }

  private logoutAndRedirectToLogin(): void {
    this.usersService.logoutAndRedirectToLogin();
  }
}