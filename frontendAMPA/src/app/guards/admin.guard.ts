import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private uService: UsersService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    
    const esAdministrador = this.isAdminLogged();

    if (esAdministrador) {
      return true;
    } else {
      return this.router.parseUrl('/unauthorized');
    }
  }

  isAdminLogged(): boolean {
    let res = this.uService.isLogAdmin()
    return res;
  }
  
}
