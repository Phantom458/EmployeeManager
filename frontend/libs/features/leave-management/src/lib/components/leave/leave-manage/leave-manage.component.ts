import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AppliedLeave, Leave } from '../../../models/leave.model';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { Observable } from 'rxjs';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-leave-manage',
  templateUrl: './leave-manage.component.html',
  styleUrls: ['./leave-manage.component.css']
})
export class LeaveManageComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>
  id: number;
  userLeaveLeft: Leave;
  userAppliedLeave: AppliedLeave;
  userData: User;

  constructor(private facadeService: LeaveManagerFacadeService,
              private route: ActivatedRoute,
              private routes: Router
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initStateData();
  }
  initData() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      )
  }
  initStateData() {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.userData = data.allUser?.find(user => this.id === user.id);
        this.userLeaveLeft = data.allLeave?.find(leave => this.id === leave.id);
        this.userAppliedLeave = data.allAppliedLeave?.find(appliedLeave => this.id === appliedLeave.id);
      })
    ).subscribe();
  }

  onApprove() {
    this.facadeService.acceptLeave(this.daysUpdate(), this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
  daysUpdate() {
    const days = this.userLeaveLeft.leave.find(x => x.type === this.userAppliedLeave.type)
    const updateLeaveDays = {}
    updateLeaveDays['leaveLeft'] = days.leaveLeft - this.userAppliedLeave.daysApplied;
    updateLeaveDays['leaveTaken'] = days.leaveTaken + this.userAppliedLeave.daysApplied;
    return updateLeaveDays;
  }
  onReject() {
    this.onCompleted();
  }
  onCancel() {
    this.onCompleted();
  }
  onCompleted() {
    this.facadeService.resetLeave(this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
}
