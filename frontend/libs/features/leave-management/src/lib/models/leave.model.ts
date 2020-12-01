export interface LeaveTypeModel {
  type: string;
  numberOfDays: number;
  leaveLeft: number;
  leaveTaken: number;
}

export interface Leave {
  id?: number;
  leave: LeaveTypeModel[]
}

export interface AppliedLeave {
  id?: number;
  type: string;
  startDate: string;
  endDate: string;
  daysApplied: number;
  interim?: string;
  adminMessage?: string;
}
