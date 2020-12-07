import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DateValidators } from '../../../misc/validators/date.validator';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { AppliedLeave } from '../../../models/leave.model';

@Component({
  selector: 'frontend-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  submitted = false;
  allAppliedLeave: AppliedLeave[];
  private id: number;

  private selectedLeave: string;
  alertMessage = null;

  leaveList = ['Casual', 'Sick', 'Maternity', 'Toil'];

  get leaveType() { return this.leaveForm.get('leaveType'); }
  get startDate() { return this.leaveForm.get('startDate'); }
  get endDate() { return this.leaveForm.get('endDate'); }
  get interim() { return this.leaveForm.get('interim'); }

  constructor(private formBuilder: FormBuilder,
              private facadeService: LeaveManagerFacadeService,
              private routes: Router,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
       this.initData();
       this.initForm();
  }
  initData() {
    this.facadeService.getAllAppliedLeave()
      .subscribe(allLeave => this.allAppliedLeave = allLeave);
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      )
  }
  initForm() {
    this.leaveForm = this.formBuilder.group({
      leaveType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      interim: ['']
    }, {validators: Validators.compose([
        DateValidators.validRange('startDate', 'endDate', { 'loadDate': true })
      ])});
  }
  changeLeave(e) {
    const {value} = e.target;
    this.selectedLeave = value;
    this.leaveForm.get('leaveType').setValue(e.target.value, {
      onlySelf: true
    })
    return true;
  }

  onApply() {
    const userLeave = this.allAppliedLeave.find(user => user.id === this.id);
    const onLeave = userLeave.daysApplied;
    if (onLeave !== 0) {
      this.alertMessage = "You cannot apply for more than one leave.";
    } else {
      this.submitted = true;
      this.facadeService.applyLeave(this.id, this.leaveType.value, this.startDate.value, this.endDate.value, this.interim.value);
      this.alertMessage = 'Leave has been applied';
    }
  }

  onHandleMessage() {
    this.alertMessage = null;
    this.onCancel();
  }
  onCancel() {
    this.routes.navigate(['user', this.id, 'detail'])
  }
}
