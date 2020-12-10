export interface LeaveType {
  type: string;
  numberOfDays: number;
  leaveLeft: number;
  leaveTaken: number;
}

export interface Leave {
  id?: number;
  leave: LeaveType[]
}

export interface AppliedLeave {
  id?: number;
  type: string;
  startDate: string;
  endDate: string;
  daysApplied: number;
  interim?: string;
  adminMessage?: string;
  leaveStatus?: string;
}
