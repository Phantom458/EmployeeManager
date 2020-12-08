import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerApiService {
  private accountURL = 'http://localhost:5000/Users';
  private leaveURL = 'http://localhost:5000/Leaves';
  private appliedURL = 'http://localhost:5000/Applied';
  private loginUrl = 'http://localhost:5000/auth/login';

  constructor(private http: HttpClient) { }

  //*** Account actions ***
  getAllAccounts(): Observable<User[]> {
    return this.http.get<User[]>(this.accountURL)
  }
  getAccountById(id: number): Observable<User> {
    return this.http.get<User>(`${this.accountURL}/${id}`).pipe(take(1));
  }
  addAccount(account: User, leave: Leave, appliedLeave: AppliedLeave): void {
    this.addUser(account);
    this.addLeave(leave);
    this.addAppliedLeave(appliedLeave);
  }
  addUser(account: User) {
    this.http.post<User>(this.accountURL, account)
      .subscribe(responseData => {console.log(responseData)});
  }
  addLeave(leave: Leave) {
    this.http.post<Leave>(this.leaveURL, leave)
      .subscribe(responseData => {console.log(responseData)});
  }
  addAppliedLeave(appliedLeave: AppliedLeave) {
    this.http.post<AppliedLeave>(this.appliedURL, appliedLeave)
      .subscribe(responseData => {console.log(responseData)});
  }

  deleteAccount(id: number): void {
    this.http.delete<User>(`${this.accountURL}/${id}`)
      .subscribe(responseData => {console.log(responseData)});
    this.http.delete<Leave>(`${this.leaveURL}/${id}`)
      .subscribe(responseData => {console.log(responseData)});
    this.http.delete<AppliedLeave>(`${this.appliedURL}/${id}`)
      .subscribe(responseData => {console.log(responseData)});
  }

  updateAccount(userData: User, id: number): void {
    this.http.patch<User>(`${this.accountURL}/${id}`, userData)
      .subscribe(responseData => console.log(responseData));
  }

  //*** Leave actions ***
  getAllLeave() : Observable<Leave[]> {
    return this.http.get<Leave[]>(this.leaveURL)
  }
  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.leaveURL}/${id}`)
  }

  //*** Leave management ***
  getAllAppliedLeave() : Observable<AppliedLeave[]> {
    return this.http.get<AppliedLeave[]>(this.appliedURL)
  }
  getAppliedLeaveById(id: number): Observable<AppliedLeave> {
    return this.http.get<AppliedLeave>(`${this.appliedURL}/${id}`).pipe(take(1));
  }
  applyLeave(leaveApplied: {}, id: number): void {
    this.http.patch<AppliedLeave[]>(`${this.appliedURL}/${id}`, leaveApplied)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
  acceptLeave(leaveData: {}, id: number) {
    this.http.patch<Leave>(`${this.leaveURL}/${id}`, leaveData)
  }
  updateAppliedLeave(leaveData: AppliedLeave, id: number) {
    this.http.patch<AppliedLeave[]>(`${this.appliedURL}/${id}`, leaveData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  //***JWT Authentication***
  login(userData): Observable<any> {
    return this.http.post<{access_token: string}>(this.loginUrl, userData);
  }
}
