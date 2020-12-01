import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';
import { ObservableStore } from '@codewithdan/observable-store';

export interface LeaveManagerStoreState{
  currentUser: User;
  currentUserLeave: Leave;
  currentUserAppliedLeave: AppliedLeave;
}

@Injectable({
  providedIn: 'root'
})

export class LeaveManagerStateService extends ObservableStore<LeaveManagerStoreState> {

  constructor() {
    super({trackStateHistory: true});
    this.initialState();
  }

  initialState(): void {
    const initialState = {
      currentUser: undefined,
      currentUserLeave: undefined,
      currentUserAppliedLeave: undefined
    }
    this.setState(initialState, 'INIT_STATE');
  }

  updateUserState(userData?: User): void {
    this.setState({currentUser: userData}, 'UPDATE_USER');
  }
  updateUserLeaveState(leaveData?: Leave): void {
    this.setState({currentUserLeave: leaveData}, 'UPDATE_USER_LEAVE');
  }
  updateUserAppliedLeaveState(appliedLeaveData?: AppliedLeave): void {
    this.setState({currentUserAppliedLeave: appliedLeaveData}, 'UPDATE_USER_APPLIED_LEAVE')
  }

  getCurrentUserState(): User {
    return this.getState().currentUser;
  }
  getCurrentUserLeaveState(): Leave {
    return this.getState().currentUserLeave;
  }
  getCurrentUserAppliedLeaveState(): AppliedLeave {
    return this.getState().currentUserAppliedLeave;
  }

  checkHistory(): void {
    console.log(this.stateHistory);
  }
}
