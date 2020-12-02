import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { LeaveManagerApiService } from './leave-manager-api.service';
import { LeaveManagerStateService, LeaveManagerStoreState } from './leave-manager-state.service';
import { LeaveManagerBlService } from './leave-manager-bl.service';
import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerFacadeService {
  private additionalLeaveData = {"leave": [{"type": "casual", "numberOfDays": 30, "leaveLeft": 30, "leaveTaken": 0},
      {"type": "sick", "numberOfDays": 60, "leaveLeft": 60, "leaveTaken": 0},
      {"type": "maternity", "numberOfDays": 180, "leaveLeft": 180, "leaveTaken": 0},
      {"type": "toil", "numberOfDays": 50, "leaveLeft": 50, "leaveTaken": 0}]};
  private additionalAppliedLeaveData = {"type": "", "startDate": "", "endDate": "", "daysApplied": 0};

  private loggedInUserId: number = null;
  private userExists = new BehaviorSubject<number>(this.loggedInUserId);

  constructor(private apiService: LeaveManagerApiService,
              private stateService: LeaveManagerStateService,
              private blService: LeaveManagerBlService
  ) { }

  //***Auth actions***
  checkUserExists(): Observable<number> {
    return this.userExists.asObservable();
  }
  removeUser(): void {
    this.userExists.next(this.loggedInUserId = null);
  }

  //*** Account actions ***
  getAllAccounts(): Observable<User[]> {
    return this.apiService.getAllAccounts().pipe(
      tap(responseData => {
        return responseData;
      }, error => error)
    );
  }

  addAccount(account: Account) {
    this.apiService.addAccount(account, this.additionalLeaveData, this.additionalAppliedLeaveData);
  }

  //*** Leave management ***
  getAllAppliedLeave(): Observable<AppliedLeave[]> {
    return this.apiService.getAllAppliedLeave().pipe(
      tap(responseData => {
        return responseData;
      }, error => error)
    );
  }

  //***State service actions***
  initialize(): void {
    this.stateService.initialState();
  }
  stateChanged(): Observable<LeaveManagerStoreState> {
    return this.stateService.stateChanged;
  }
  checkHistory(): void {
    this.stateService.checkHistory();
  }

  storeUserDataToState(id: number) {
    this.userExists.next(this.loggedInUserId = id);
    this.apiService.getAccountById(id).pipe(
      tap(responseData => {
        this.stateService.updateUserState(responseData);
      }, error => error)
    );
    this.apiService.getLeaveById(id).pipe(
      tap(responseData => {
        this.stateService.updateUserLeaveState(responseData);
      }, error => error)
    );
    this.apiService.getAppliedLeaveById(id).pipe(
      tap(responseData => {
        this.stateService.updateUserAppliedLeaveState(responseData);
      }, error => error)
    );
  }

  getUserState(): User {
    return this.stateService.getCurrentUserState();
  }
  getUserLeaveState(): Leave {
    return this.stateService.getCurrentUserLeaveState();
  }
  getUserAppliedLeaveState(): AppliedLeave {
    return this.stateService.getCurrentUserAppliedLeaveState();
  }
}
