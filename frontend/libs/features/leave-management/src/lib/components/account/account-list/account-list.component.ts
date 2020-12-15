import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { Observable } from 'rxjs';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  users: User[];
  errorMessage;

  constructor(private facadeService: LeaveManagerFacadeService) {
  }

  ngOnInit(): void {
    this.initStateData();
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => this.users = data.allUser)
    ).subscribe();
  }
}
