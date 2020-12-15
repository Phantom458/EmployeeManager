import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { LeaveManagerFacadeService } from 'libs/features/leave-management/src/lib/services/leave-manager-facade.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { LeaveManagerStoreState } from '../../../../../../../libs/features/leave-management/src/lib/services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  userId: number;
  admin = false;
  userExist = false;

  constructor(public facadeService: LeaveManagerFacadeService,
              private routes: Router
  ) { }

  ngOnInit(): void {
    this.initData();
  }
  initData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.userId = data.activeId})
    ).subscribe();
    this.facadeService.isAdmin$().subscribe(
      admin => this.admin = admin
    );
    this.facadeService.isLoggedIn$().subscribe(
      loggedIn => this.userExist = loggedIn
    );
  }

  onLogout(): void {
    this.facadeService.logout();
    this.facadeService.removeUser();
    this.routes.navigate(['auth/login']);
  }
}
