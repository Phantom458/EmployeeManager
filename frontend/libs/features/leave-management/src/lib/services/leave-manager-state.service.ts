import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AppliedLeave, Leave } from '../models/leave.model';
import { ObservableStore } from '@codewithdan/observable-store';

export interface LeaveManagerStoreState{
  currentUser: User;
  currentUserLeave: Leave;
  currentUserAppliedLeave: AppliedLeave;
  allUser: User[],
  allLeave: Leave[],
  allAppliedLeave: AppliedLeave[],
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
      currentUserAppliedLeave: undefined,
      allUser: [],
      aLeave: [],
      allAppliedLeave: [],
    }
    this.setState(initialState, 'INIT_STATE');
  }

  updateUserState(userData?: User[]): void {
    this.setState({allUser: userData}, 'UPDATE_USER');
  }

  updateAllUserState(allUser?: User[]): void {
    this.setState({allUser: allUser}, 'UPDATE_ALL_USER')
  }
  updateAllLeaveState(allLeave?: Leave[]): void {
    this.setState({allLeave: allLeave}, 'UPDATE_ALL_USER_LEAVE')
  }
  updateAllAppliedLeaveState(allAppliedLeave?: AppliedLeave[]): void {
    this.setState({allAppliedLeave: allAppliedLeave}, 'UPDATE_ALL_USER_APPLIED_LEAVE')
  }

  checkHistory(): void {
    console.log(this.stateHistory);
  }
}
