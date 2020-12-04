import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaveManagerFacadeService } from '../../services/leave-manager-facade.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private facadeService: LeaveManagerFacadeService,
              private routes: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userExist = false;
    this.facadeService.isLoggedIn().subscribe(
      value => userExist = value
    );
    if (userExist) {
      return true;
    } else {
      this.routes.createUrlTree(['/']);
    }
  }
}
