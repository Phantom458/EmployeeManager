import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private Http: HttpClient,
              private routes: Router) { }

  private hasId: number = null;
  private role = new BehaviorSubject<number>(this.hasId);

  loginUser(id: number) {
    this.role.next(this.hasId = id);
    if (id === 1) {
      this.routes.navigate(['login-signup/account','list']);
    } else {
      this.routes.navigate(['login-signup/account', id, 'detail']);
    }
  }
  checkRole(): Observable<number> {
    return this.role.asObservable();
  }

  logoutUser() {
    this.role.next(this.hasId = null);
    this.routes.navigate(['login-signup/login']);
  }
}
