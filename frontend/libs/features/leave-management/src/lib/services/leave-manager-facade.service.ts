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
  getAccountById(id: number): Observable<User> {
    return this.apiService.getAccountById(id).pipe(
      tap(responseData => {
        return responseData;
      }, error => error)
    )
  }

  addAccount(account: Account): void {
    this.apiService.addAccount(account, this.additionalLeaveData, this.additionalAppliedLeaveData);
  }
  deleteAccount(id: number): void {
    this.apiService.deleteAccount(id);
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
    this.apiService.getAccountById(id).subscribe(
      responseData => this.stateService.updateUserState(responseData)
    );
    this.apiService.getLeaveById(id).subscribe(
      responseData => this.stateService.updateUserLeaveState(responseData)
    );
    this.apiService.getAppliedLeaveById(id).subscribe(
      responseData => this.stateService.updateUserAppliedLeaveState(responseData)
    );
  }
  updateUserState(userData: User, id: number) {
    this.stateService.updateUserState(userData);
    this.apiService.updateAccount(userData, id);
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
