import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { User } from '../../../models/user.model';
import { AppliedLeave, Leave } from '../../../models/leave.model';

@Component({
  selector: 'frontend-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  targetUser: User;
  targetLeave: Leave;
  targetAppliedLeave: AppliedLeave;
  allUser: User[];
  allLeave: Leave[];
  allAppliedLeave: AppliedLeave[];
  adminMessage: string;
  id: number;
  admin = false;

  constructor(private route: ActivatedRoute,
              private routes: Router,
              private facadeService: LeaveManagerFacadeService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initStateData();
  }
  initData(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      );
    this.facadeService.isAdmin$().subscribe(
      admin => this.admin = admin
    );
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.allUser = data.allUser;
        this.targetUser = data.allUser?.find(user => this.id === user.id);
        this.allLeave = data.allLeave;
        this.targetLeave = data.allLeave?.find(leave => this.id === leave.id);
        this.allAppliedLeave = data.allAppliedLeave;
        this.targetAppliedLeave = data.allAppliedLeave?.find(appliedLeave => this.id === appliedLeave.id);
      })
    ).subscribe();
    this.adminMessage = this.targetAppliedLeave?.adminMessage;
  }

  onEdit(): void {
    if (this.facadeService.isAdmin()) {
      this.routes.navigate(['../edit/status'], {relativeTo: this.route});
    } else {
      this.routes.navigate(['../edit'], {relativeTo: this.route});
    }
  }
  removeUserFromState(): void {
    this.allUser.splice(this.allUser.findIndex(getUser => this.targetUser === getUser), 1);
    this.allLeave.splice(this.allLeave.findIndex(getLeave => this.targetLeave === getLeave), 1);
    this.allAppliedLeave.splice(this.allAppliedLeave.findIndex(appliedLeave => this.targetAppliedLeave === appliedLeave), 1);
    this.facadeService.updateUserState(this.allUser);
    this.facadeService.updateLeaveState(this.allLeave);
    this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
  }
  onDelete(): void {
    this.removeUserFromState();
    this.facadeService.deleteAccount(this.id);
    this.adminMessage = 'Account has been successfully removed';
  }

  removeMessage(): void {
    this.allAppliedLeave.splice(this.allAppliedLeave.findIndex(getUser => getUser.id === this.targetAppliedLeave.id), 1, {
      ...this.targetAppliedLeave, adminMessage: ''
    });
  }

  onHandleAdminMessage(): void {
    if(this.admin) {
      this.adminMessage = null;
      this.routes.navigate(['../../list'], { relativeTo: this.route })
    }
    else if(this.targetAppliedLeave.daysApplied !== 0){
      this.removeMessage();
      this.facadeService.updateMessage(this.allAppliedLeave);
      this.adminMessage = null;
    }
    else{
      this.facadeService.resetLeave(this.id);
      this.adminMessage = null;
    }
  }
}
