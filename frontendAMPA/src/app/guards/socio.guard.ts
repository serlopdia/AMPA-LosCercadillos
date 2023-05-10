import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class SocioGuard implements CanActivate {

  constructor(private router: Router, private usersService: UsersService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    
    const esSocio = this.isSocioLogged();

    if (esSocio) {
      return true;
    } else {
      return this.router.parseUrl('/unauthorized');
    }
  }

  isSocioLogged(): boolean {
    let res = false;
    if(this.usersService.isLoggedIn() && !this.usersService.isLogAdmin()) {
      res = true;
    }
    return res;
  }
  
}
