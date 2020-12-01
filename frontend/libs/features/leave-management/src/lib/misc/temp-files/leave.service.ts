import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppliedLeave, Leave } from '../../models/leave.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  daysApplied: number;

  private leaveURL = 'http://localhost:3000/Leaves';
  private appliedURL = 'http://localhost:3000/Applied';

  constructor(private Http: HttpClient
  ) {}

  //Storing default leave values for newly registered users
  createLeave(defaultLeave: Leave) {
    return this.Http.post<Leave>(this.leaveURL, defaultLeave)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  //To display applied leave in LeaveListComponent and LeaveManagementComponent
  getAppliedLeave(): Observable<AppliedLeave[]> {
    return this.Http.get<AppliedLeave[]>(this.appliedURL)
  }
  getAppliedLeaveById(id: number): Observable<AppliedLeave> {
    return this.Http.get<AppliedLeave>(`${this.appliedURL}/${id}`)
  }
  getLeaveById(id: number): Observable<Leave> {
    return this.Http.get<Leave>(`${this.leaveURL}/${id}`)
  }

  //Save applied leave to database
  applyLeave(id: number, type: string, startDate: string, endDate: string, interim: string) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    this.daysApplied = (end.getTime() - start.getTime())/(1000*3600*24);

    const leaveApplied = {};
    leaveApplied['id'] = id;
    leaveApplied['type'] = type;
    leaveApplied['startDate'] = startDate;
    leaveApplied['endDate'] = endDate;
    leaveApplied['daysApplied'] = this.daysApplied;
    leaveApplied['interim'] = interim;
    return this.Http.post<AppliedLeave[]>(this.leaveURL, leaveApplied)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  //Functions to update leave taken days for specific login-signup
  onLeaveAccept(id: number, updatedLeave: object) {
    return this.Http.patch<number>(`${this.leaveURL}/${id}`, updatedLeave)
      .subscribe(responseData => {
        console.log(responseData);
      });
    return this.Http.patch<string>(`${this.appliedURL}/${id}`, {"adminMessage": "Your leave has been approved. Please inform to the HR office once you are back"})
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
  resetLeaveData(id: number) {
    return this.Http.patch<AppliedLeave[]>(`${this.appliedURL}/${id}`,this.resetAppliedLeave())
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
  onLeaveReject(id: number) {
    return this.Http.patch<string>(`${this.appliedURL}/${id}`, ({"adminMessage": "Your leave has been rejected. Please contact HR for details."}))
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  //To delete with account deletion
  deleteLeave(id: number) {
    return this.Http.delete<Leave>(`${this.leaveURL}/${id}`)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  resetAppliedLeave() {
    const appliedLeaveReset = {};
    appliedLeaveReset["type"] = "";
    appliedLeaveReset["startDate"] = "";
    appliedLeaveReset["endDate"] = "";
    appliedLeaveReset["daysApplied"] = 0;
    appliedLeaveReset["adminMessage"] = "";
    return appliedLeaveReset;
  }
}
