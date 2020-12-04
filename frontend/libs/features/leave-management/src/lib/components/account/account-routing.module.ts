import { NgModule } from '@angular/core';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountListComponent } from './account-list/account-list.component';
import { StatusEditComponent } from './account-detail/status-edit/status-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { AdminGuard } from '../../misc/guards/admin.guard';

const routes: Routes = [
  {
    path: ':id/detail',
    component: AccountDetailComponent
  },
  {
    path: 'list',
    component: AccountListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: ':id/edit/status',
    component: StatusEditComponent
  },
  {
    path: ':id/edit',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
