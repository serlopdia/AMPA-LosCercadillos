import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Observable, first, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocioGuard implements CanActivate {

  constructor(private router: Router, private usersService: UsersService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    
    return this.isSocioLogged().pipe(
      map(esSocio => {
        const esUsuario = this.isUsuarioLogged();

        if (esSocio) {
          return true;
        } else if (!esUsuario) {
          return this.router.parseUrl('/unauthorized');
        } else {
          return this.router.parseUrl('/not-socio');
        }
      })
    );
  }

  isSocioLogged(): Observable<boolean> {
    return this.usersService.checkEsSocio().pipe(
      map(esSocio => {
        return esSocio;
      }),
      first()
    );
  }

  isUsuarioLogged(): boolean {
    let res = false;
    if (this.usersService.isLoggedIn() && !this.usersService.isLogAdmin()) {
      res = true;
    }
    return res;
  }
}