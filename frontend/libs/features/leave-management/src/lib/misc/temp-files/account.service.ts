import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { User } from '../../models/user.model';
import { AppliedLeave, Leave } from '../../models/leave.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private additionalLeaveData = {"leave": [{"type": "casual", "numberOfDays": 30, "leaveLeft": 30, "leaveTaken": 0},
      {"type": "sick", "numberOfDays": 60, "leaveLeft": 60, "leaveTaken": 0},
      {"type": "maternity", "numberOfDays": 180, "leaveLeft": 180, "leaveTaken": 0},
      {"type": "toil", "numberOfDays": 50, "leaveLeft": 50, "leaveTaken": 0}]};
  private additionalAppliedLeaveData = {"type": "", "startDate": "", "endDate": "", "daysApplied": 0};
  id: number;
  private adminMessage: string = null;
  private displayMessage = new BehaviorSubject<string>(this.adminMessage);

  constructor(private http: HttpClient) {
  }

  private accountURL = 'http://localhost:3000/Users';
  private leaveURL = 'http://localhost:3000/Leaves';
  private appliedURL = 'http://localhost:3000/Applied';


  checkMessage(): Observable<string> {
    return this.displayMessage.asObservable();
  }

  updateAccount(user: User, id: number) {
    return this.http.patch<User>(`${this.accountURL}/${id}`, user)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
  updateStatus(status: object, id: number) {
    return this.http.patch<object>(`${this.accountURL}/${id}`, status)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
  deleteAccount(id: number) {
    return this.http.delete<User>(`${this.accountURL}/${id}`)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  setMessage(message: string) {
    this.displayMessage.next(this.adminMessage = message);
  }
  resetMessage() {
    this.displayMessage.next(this.adminMessage = null);
  }
}
