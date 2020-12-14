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

  private admin = false;
  private admin$ = new BehaviorSubject<boolean>(this.admin);
  private loggedIn = false;
  private loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  private daysApplied: number;

  constructor(private apiService: LeaveManagerApiService,
              private stateService: LeaveManagerStateService,
              private blService: LeaveManagerBlService
  ) { }

  //***Auth actions***
  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
  isAdmin$(): Observable<boolean> {
    return this.admin$.asObservable();
  }
  removeUser(): void {
    this.loggedIn$.next(this.loggedIn = false);
    this.admin$.next(this.admin = false);
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
  updateMessage(appliedLeave: AppliedLeave[]) {
    this.stateService.updateAllAppliedLeaveState(appliedLeave);
  }

  //***State service actions***
  initialize(): void {
    this.stateService.initialState();
  }
  stateChanged(): Observable<LeaveManagerStoreState> {
    return this.stateService.stateChanged;
  }
  storeAllDataToState() {
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
    this.apiService.login(userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }))
      .subscribe();
    this.updateAuth();
  }
  updateAuth() {
    setTimeout(() => {
      if(this.isAdmin()) {
        this.loggedIn$.next(this.loggedIn = true);
        this.admin$.next(this.admin = true);
      } else if(this.isLoggedIn()) {
        this.loggedIn$.next(this.loggedIn = true);
      }
    }, 1000);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.admin$.next(this.admin = false);
    this.loggedIn$.next(this.loggedIn = false);
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
  isAdmin(): boolean {
    return JSON.parse(localStorage.getItem('user'))?.role === 'admin';
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return tokenNotExpired(null, token);
  // }
}
