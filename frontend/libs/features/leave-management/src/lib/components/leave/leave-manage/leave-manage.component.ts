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
  allUserLeave: Leave[];
  activeUserLeave: Leave;
  allAppliedLeave: AppliedLeave[];
  activeUserAppliedLeave: AppliedLeave;
  userData: User;
  messageStatus: string;

  constructor(private facadeService: LeaveManagerFacadeService,
              private route: ActivatedRoute,
              private routes: Router
  ) { }

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
      )
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.userData = data.allUser?.find(user => this.id === user.id);
        this.allUserLeave = data.allLeave;
        this.activeUserLeave = data.allLeave?.find(leave => this.id === leave.id);
        this.allAppliedLeave = data.allAppliedLeave;
        this.activeUserAppliedLeave = data.allAppliedLeave?.find(appliedLeave => this.id === appliedLeave.id);
      })
    ).subscribe();
    this.messageStatus = this.activeUserAppliedLeave?.leaveStatus;
  }

  onApprove(): void {
    const userInfo = {leaveStatus: 'Approved', adminMessage: 'Your application has been approved.'}
    this.alterLeaveData();
    this.facadeService.updateLeaveState(this.allUserLeave);
    this.facadeService.updateLeave(this.activeUserLeave, this.id);
    this.updateAppliedLeave(userInfo);
  }
  alterLeaveData(): void {
    const updatedDays = this.facadeService.updateLeaveTypeDays(this.activeUserLeave, this.activeUserAppliedLeave)
    this.activeUserLeave.leave.splice(this.activeUserLeave.leave.findIndex(appliedType => appliedType.type === this.activeUserAppliedLeave.type), 1, updatedDays);
    this.allUserLeave.splice(this.allUserLeave.findIndex(getUser => getUser.id === this.activeUserLeave.id), 1, this.activeUserLeave);
  }
  alterAppliedLeaveData(info: {}): void {
    this.allAppliedLeave.splice(this.allAppliedLeave.findIndex(getLeave => getLeave.id === this.activeUserAppliedLeave.id), 1, {
      ...this.activeUserAppliedLeave, ...info });
  }

  onReject(): void {
    const userInfo = {leaveStatus: '', adminMessage: 'Your application has been rejected. Please contact admin for details', id: this.id};
    this.eraseAppliedLeaveState(userInfo);
    this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
    this.facadeService.updateAppliedLeaveInfo({ ...this.activeUserAppliedLeave, ...userInfo }, this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
  onCancel(): void {
    const userInfo = {leaveStatus: '', adminMessage: 'Your application has been cancelled.', id: this.id};
    this.eraseAppliedLeaveState(userInfo);
    this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
    this.facadeService.updateAppliedLeaveInfo({ ...this.activeUserAppliedLeave, ...userInfo }, this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
  onCompleted(): void {
    const userInfo = {leaveStatus: '', adminMessage: 'Welcome back', id:this.id};
    this.eraseAppliedLeaveState(userInfo);
    this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
    this.facadeService.updateAppliedLeaveInfo({ ...this.activeUserAppliedLeave, ...userInfo }, this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
  eraseAppliedLeaveState(info: {}): void {
    const defaultAppliedLeave = this.facadeService.getDefaultAppliedLeave();
    this.allAppliedLeave.splice(this.allAppliedLeave.findIndex(getLeave => getLeave.id === this.activeUserAppliedLeave.id), 1, {
      ...defaultAppliedLeave, ...info});
  }
  updateAppliedLeave(userInfo: {}): void {
    this.alterAppliedLeaveData(userInfo);
    this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
    this.facadeService.updateAppliedLeaveInfo({ ...this.activeUserAppliedLeave, ...userInfo }, this.id);
    this.routes.navigate(['../../list'], {relativeTo: this.route});
  }
}
