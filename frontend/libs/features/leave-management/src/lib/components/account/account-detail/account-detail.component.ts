import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';

@Component({
  selector: 'frontend-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  adminMessage: string;

  userId: number;
  userAuth: number;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private routes: Router,
              private facadeService: LeaveManagerFacadeService
  ) {}

  ngOnInit(): void {
    this.state$ = this.facadeService.stateChanged()
    this.state$.pipe(
      tap(message => this.adminMessage = message.currentUserAppliedLeave.adminMessage)
    );
    this.initData();
  }
  initData() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userId = +params['id'];
        }
      );
    this.subscription = this.facadeService.checkUserExists().subscribe(
      id => {
        this.userAuth = id;
      }
    );
  }

  onEdit() {
    if (this.userAuth === 1) {
      this.routes.navigate(['../edit/status'], {relativeTo: this.route});
    } else {
      this.routes.navigate(['../edit'], {relativeTo: this.route});
    }
  }
  onDelete() {
    this.facadeService.deleteAccount(this.userId);
    this.adminMessage = 'Account has been successfully removed';
  }

  onHandleAdminMessage() {
    if (this.userAuth) {
      this.adminMessage = null
    } else {
      this.facadeService.removeUser();
      this.routes.navigate(['auth/login'])
    }
  }
}
