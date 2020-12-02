import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';

@Component({
  selector: 'frontend-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  users: User[];
  errorMessage;

  constructor(private facadeService: LeaveManagerFacadeService) { }

  ngOnInit(): void {
    this.facadeService.getAllAccounts()
      .subscribe(allAccounts => this.users = allAccounts,
        error => this.errorMessage = error);
  }
}
