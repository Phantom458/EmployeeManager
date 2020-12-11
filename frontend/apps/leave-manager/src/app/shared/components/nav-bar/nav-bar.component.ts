import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// tslint:disable-next-line:nx-enforce-module-boundaries
import { LeaveManagerFacadeService } from 'libs/features/leave-management/src/lib/services/leave-manager-facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userId: number;
  admin = false;
  userExist = false;

  constructor(public facadeService: LeaveManagerFacadeService,
              private routes: Router
  ) { }

  ngOnInit(): void {
    this.initData();
  }
  initData() {
    this.facadeService.isAdmin$().subscribe(
      admin => this.admin = admin
    );
    this.facadeService.isLoggedIn$().subscribe(
      loggedIn => this.userExist = loggedIn
    );
  }

  onLogout() {
    this.facadeService.logout();
    this.facadeService.removeUser();
    this.routes.navigate(['auth/login']);
  }
}
