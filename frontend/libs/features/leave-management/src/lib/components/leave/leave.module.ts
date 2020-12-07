import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveDisplayComponent } from './leave-list/leave-display/leave-display.component';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { LeaveComponent } from './leave.component';
import { LeaveRoutingModule } from './leave-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@frontend/shared-components';

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveDisplayComponent,
    LeaveFormComponent,
    LeaveComponent
  ],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ]
})
export class LeaveModule { }
