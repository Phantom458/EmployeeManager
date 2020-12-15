import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateValidators } from '../../../misc/validators/date.validator';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { AppliedLeave } from '../../../models/leave.model';
import { Observable } from 'rxjs';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  leaveForm: FormGroup;
  submitted = false;
  allAppliedLeave: AppliedLeave[];
  activeUserAppliedLeave: AppliedLeave;
  private id: number;
  private selectedLeave: string;
  alertMessage = null;
  leaveList = ['casual', 'sick', 'maternity', 'toil'];

  constructor(private formBuilder: FormBuilder,
              private facadeService: LeaveManagerFacadeService,
              private routes: Router,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
       this.initId();
       this.initForm();
       this.initStateData();
  }
  initId(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      )
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.allAppliedLeave = data.allAppliedLeave;
        this.activeUserAppliedLeave = data?.allAppliedLeave.find(user => this.id === user?.id);
      })
    ).subscribe();
  }
  initForm(): void {
    this.leaveForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      interim: ['']
    }, {validators: Validators.compose([
        DateValidators.validRange('startDate', 'endDate', { 'loadDate': true })
      ])});
  }
  changeLeave(e): boolean {
    const {value} = e.target;
    this.selectedLeave = value;
    this.leaveForm.get('type').setValue(e.target.value, {
      onlySelf: true
    })
    return true;
  }

  onApply(): void {
    const onLeave = this.activeUserAppliedLeave.daysApplied;
    if (onLeave !== 0) {
      this.alertMessage = "You cannot apply for more than one leave.";
    } else {
      this.submitted = true;
      const daysApplied = this.facadeService.calculateDays(this.leaveForm.value);
      const applyLeave = { ...this.leaveForm.value, id: this.id, daysApplied: daysApplied, leaveStatus: 'Pending' };
      this.allAppliedLeave?.splice(this.allAppliedLeave.findIndex(getUser => getUser.id === this.activeUserAppliedLeave.id), 1, applyLeave);
      this.facadeService.updateAppliedLeaveState(this.allAppliedLeave);
      this.facadeService.applyLeave(applyLeave, this.id);
      this.alertMessage = 'Leave has been applied';
    }
  }
  onHandleMessage(): void {
    this.alertMessage = null;
    this.onCancel();
  }
  onCancel(): void {
    this.routes.navigate(['user', this.id, 'detail'])
  }

  get startDate(): AbstractControl { return this.leaveForm.get('startDate'); }
  get endDate(): AbstractControl { return this.leaveForm.get('endDate'); }
}
