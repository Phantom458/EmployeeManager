import { Component, OnInit } from '@angular/core';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { AppliedLeave } from '../../../models/leave.model';

@Component({
  selector: 'frontend-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  appliedList: AppliedLeave[];

  constructor(private facadeService: LeaveManagerFacadeService
  ) { }

  ngOnInit(): void {
    this.facadeService.getAllAppliedLeave().subscribe(
      leaveList => this.appliedList = leaveList
    );
  }

}
