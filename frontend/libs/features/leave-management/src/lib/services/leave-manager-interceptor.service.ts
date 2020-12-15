import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveManagerFacadeService } from './leave-manager-facade.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerInterceptorService implements HttpInterceptor {

  constructor(public facadeService: LeaveManagerFacadeService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.facadeService.getToken()}`
      }
    });
    return next.handle(request);
  }
}
