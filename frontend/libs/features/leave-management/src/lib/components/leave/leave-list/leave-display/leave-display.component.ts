import { Component, Input, OnInit } from '@angular/core';
import { AppliedLeave } from '../../../../models/leave.model';

@Component({
  selector: 'frontend-leave-display',
  templateUrl: './leave-display.component.html',
  styleUrls: ['./leave-display.component.css']
})
export class LeaveDisplayComponent implements OnInit {
  @Input() appliedLeaveData: AppliedLeave;

  constructor() { }

  ngOnInit(): void {
  }

}
