import { Component, OnInit } from '@angular/core';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { AppliedLeave } from '../../../models/leave.model';
import { Observable } from 'rxjs';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  appliedList: AppliedLeave[];

  constructor(private facadeService: LeaveManagerFacadeService
  ) { }

  ngOnInit(): void {
    this.initStateData();
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => this.appliedList = data.allAppliedLeave)
    ).subscribe();
  }
}
