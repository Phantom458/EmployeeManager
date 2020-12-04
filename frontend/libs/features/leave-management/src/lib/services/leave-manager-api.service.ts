import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';
import { take, tap } from 'rxjs/operators';

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
  addAccount(account: Account, leave: Leave, appliedLeave: AppliedLeave): void {
    this.http.post<User>(this.accountURL, account)
      .subscribe(responseData => {console.log(responseData)});
    this.http.post<Leave>(this.leaveURL, leave)
      .subscribe(responseData => {console.log(responseData)});
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
    this.http.put<User>(`${this.accountURL}/${id}`, userData)
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

  //***JWT Authentication***
  login(userData): Observable<any> {
    return this.http.post<{access_token: string}>(this.loginUrl, userData);
  }
}
