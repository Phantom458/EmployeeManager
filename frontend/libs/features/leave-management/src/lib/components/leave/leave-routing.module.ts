import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../misc/guards/admin.guard';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { LeaveListComponent } from './leave-list/leave-list.component';

const routes: Routes = [
  {
    path: ':id/apply',
    component: LeaveFormComponent
  },
  {
    path: 'list',
    component: LeaveListComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
