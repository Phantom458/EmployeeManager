import { Injectable } from '@angular/core';
import { AppliedLeave, Leave, LeaveType } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagerBlService {

  constructor() { }

  updateLeaveTypeDays(activeUserLeave: Leave, userAppliedLeave: AppliedLeave): LeaveType {
    const appliedLeaveType = activeUserLeave.leave?.find(x => x.type === userAppliedLeave.type)
    const updateLeaveDays = {}
    updateLeaveDays['leaveLeft'] = appliedLeaveType?.leaveLeft - userAppliedLeave.daysApplied;
    updateLeaveDays['leaveTaken'] = appliedLeaveType?.leaveTaken + userAppliedLeave.daysApplied;
    console.log(appliedLeaveType, updateLeaveDays, {...appliedLeaveType,...updateLeaveDays});
    return {...appliedLeaveType, ...updateLeaveDays};
  }
}
