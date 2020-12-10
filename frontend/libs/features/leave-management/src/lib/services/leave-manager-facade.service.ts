import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { LeaveManagerApiService } from './leave-manager-api.service';
import { LeaveManagerStateService, LeaveManagerStoreState } from './leave-manager-state.service';
import { LeaveManagerBlService } from './leave-manager-bl.service';
import { User } from '../models/user.model';
import { AppliedLeave, Leave, LeaveType } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerFacadeService {
  private defaultLeaveData = {"leave": [{"type": "casual", "numberOfDays": 30, "leaveLeft": 30, "leaveTaken": 0},
      {"type": "sick", "numberOfDays": 60, "leaveLeft": 60, "leaveTaken": 0},
      {"type": "maternity", "numberOfDays": 180, "leaveLeft": 180, "leaveTaken": 0},
      {"type": "toil", "numberOfDays": 50, "leaveLeft": 50, "leaveTaken": 0}]};
  private defaultAppliedLeaveData = {"type": "", "startDate": "", "endDate": "", "daysApplied": 0,
    "interim": "", "leaveState": ""};

  private loggedInUserId: number = null;
  private userExists = new BehaviorSubject<number>(this.loggedInUserId);
  private loggedIn = false;
  private loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

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
  addAccount(account: User): void {
    this.apiService.addAccount(account, this.defaultLeaveData, this.defaultAppliedLeaveData);
  }
  updateAccount(userData: User, id: number) {
    this.apiService.updateAccount(userData, id);
  }
  deleteAccount(id: number): void {
    this.apiService.deleteAccount(id);
  }

  //***Leave Actions***
  getAllLeave(): Observable<Leave[]> {
    return this.apiService.getAllLeave().pipe(
      tap(responseData => {
        return responseData;
      }, error => error)
    );
  }

  //*** Leave management ***
  getAllAppliedLeave(): Observable<AppliedLeave[]> {
    return this.apiService.getAllAppliedLeave().pipe(
      tap(responseData => {
        return responseData;
      }, error => error)
    );
  }
  applyLeave(leaveData: AppliedLeave, id: number) {
    this.apiService.applyLeave(leaveData, id);
  }
  calculateDays(leaveData: AppliedLeave): number {
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    return ((end.getTime() - start.getTime())/(1000*3600*24));
  }
  resetLeave(id: number) {
    this.apiService.updateAppliedLeave(this.defaultAppliedLeaveData, id);
  }
  updateLeave(leaveData: Leave, id: number) {
    this.apiService.acceptLeave(leaveData, id);
  }
  updateLeaveTypeDays(activeUserLeave: Leave, userAppliedLeave: AppliedLeave): LeaveType {
    return this.blService.updateLeaveTypeDays(activeUserLeave, userAppliedLeave);
  }
  updateAppliedLeaveInfo(appliedLeaveInfo: {}, id: number) {
    this.apiService.updateAppliedLeaveInfo(appliedLeaveInfo, id);
  }

  //***State service actions***
  initialize(): void {
    this.stateService.initialState();
  }
  stateChanged(): Observable<LeaveManagerStoreState> {
    return this.stateService.stateChanged;
  }
  storeAllDataToState(id: number) {
    this.userExists.next(this.loggedInUserId = id);
    this.apiService.getAllAccounts().subscribe(
      responseData => this.stateService.updateAllUserState(responseData)
    );
    this.apiService.getAllLeave().subscribe(
      responseData => this.stateService.updateAllLeaveState(responseData)
    );
    this.apiService.getAllAppliedLeave().subscribe(
      responseData => this.stateService.updateAllAppliedLeaveState(responseData)
    );
  }
  updateUserState(userData: User[]): void {
    this.stateService.updateAllUserState(userData);
  }
  updateLeaveState(leaveData: Leave[]): void {
    this.stateService.updateAllLeaveState(leaveData);
  }
  updateAppliedLeaveState(leaveData: AppliedLeave[]): void {
    this.stateService.updateAllAppliedLeaveState(leaveData);
  }


  //***JWT Authentication***
  loginUser(userData) {
    this.apiService.login(userData)
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.loggedIn$.next(this.loggedIn = true);
      });
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
  isAdmin(): boolean {
    return JSON.parse(localStorage.getItem('user'))?.role === 'admin';
  }
}
