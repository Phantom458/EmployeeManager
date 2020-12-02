import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'frontend-account-display',
  templateUrl: './account-display.component.html',
  styleUrls: ['./account-display.component.css']
})
export class AccountDisplayComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
