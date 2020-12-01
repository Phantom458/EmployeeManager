import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerApiService {
  private accountURL = 'http://localhost:3000/Users';
  private leaveURL = 'http://localhost:3000/Leaves';
  private appliedURL = 'http://localhost:3000/Applied';

  constructor(private http: HttpClient) { }

  //*** Account actions ***
  getAllAccounts(): Observable<User[]> {
    return this.http.get<User[]>(this.accountURL)
  }
  getAccountById(id: number): Observable<User> {
    return this.http.get<User>(`${this.accountURL}/${id}`);
  }
  addAccount(account: Account, leave: Leave, appliedLeave: AppliedLeave) {
    this.http.post<User>(this.accountURL, account)
      .subscribe(responseData => {console.log(responseData)});
    this.http.post<Leave>(this.leaveURL, leave)
      .subscribe(responseData => {console.log(responseData)});
    this.http.post<AppliedLeave>(this.appliedURL, appliedLeave)
      .subscribe(responseData => {console.log(responseData)});
  }

  //*** Leave actions ***
  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.leaveURL}/${id}`)
  }

  //*** Leave management ***
  getAllAppliedLeave() : Observable<AppliedLeave[]> {
    return this.http.get<AppliedLeave[]>(this.appliedURL)
  }
  getAppliedLeaveById(id: number): Observable<AppliedLeave> {
    return this.http.get<AppliedLeave>(`${this.appliedURL}/${id}`)
  }
}
