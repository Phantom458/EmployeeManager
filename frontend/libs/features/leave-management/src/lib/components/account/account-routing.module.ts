import { NgModule } from '@angular/core';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountListComponent } from './account-list/account-list.component';
import { StatusEditComponent } from './account-detail/status-edit/status-edit.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':id/detail',
    component: AccountDetailComponent
  },
  {
    path: 'list',
    component: AccountListComponent
  },
  {
    path: ':id/edit',
    component: StatusEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
