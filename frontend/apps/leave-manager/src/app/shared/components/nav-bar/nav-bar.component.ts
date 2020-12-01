import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// tslint:disable-next-line:nx-enforce-module-boundaries
import { LeaveManagerFacadeService } from 'libs/features/leave-management/src/lib/services/leave-manager-facade.service';

@Component({
  selector: 'frontend-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userId: number;
  private subscription: Subscription;

  constructor(public facadeService: LeaveManagerFacadeService) { }

  ngOnInit(): void {
    this.subscription = this.facadeService.checkUserExists().subscribe(
      id => {
        this.userId = id;
      },
      err => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  onLogout() {
    this.facadeService.removeUser();
  }
}
