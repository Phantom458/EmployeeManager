import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveDisplayComponent } from './leave-list/leave-display/leave-display.component';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { LeaveComponent } from './leave.component';
import { LeaveRoutingModule } from './leave-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@frontend/shared-components';
import { LeaveManageComponent } from './leave-manage/leave-manage.component';

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveDisplayComponent,
    LeaveFormComponent,
    LeaveComponent,
    LeaveManageComponent
  ],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ]
})
export class LeaveModule { }
