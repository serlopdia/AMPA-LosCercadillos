import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private router: Router, private usersService: UsersService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    
    const esUsuario = this.isUsuarioLogged();

    if (esUsuario) {
      return true;
    } else {
      return this.router.parseUrl('/unauthorized');
    }
  }

  isUsuarioLogged(): boolean {
    let res = false;
    if(this.usersService.isLoggedIn() && !this.usersService.isLogAdmin()) {
      res = true;
    }
    return res;
  }
  
}
