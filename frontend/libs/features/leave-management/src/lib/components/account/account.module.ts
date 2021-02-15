import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountDisplayComponent } from './account-list/account-display/account-display.component';
import { StatusEditComponent } from './account-detail/status-edit/status-edit.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedComponentsModule } from '@frontend/shared-components'
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AccountComponent,
    AccountListComponent,
    AccountDisplayComponent,
    StatusEditComponent,
    AccountDetailComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  exports: [MatCardModule, MatButtonModule, MatTableModule]
})
export class AccountModule { }
