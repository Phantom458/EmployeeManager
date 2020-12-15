import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LeaveManagerStoreState } from '../../../../services/leave-manager-state.service';
import { User } from '../../../../models/user.model';
import { LeaveManagerFacadeService } from '../../../../services/leave-manager-facade.service';

@Component({
  selector: 'frontend-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {
  private statusUpdateForm: FormGroup;
  submitted = false;
  formMessage: string;
  state$: Observable<LeaveManagerStoreState>;
  userData: User[];
  currentUser: User;
  id: number;

  statusList=['At Work', 'On Leave', 'Inactive'];

  constructor(private formBuilder: FormBuilder,
              private facadeService: LeaveManagerFacadeService,
              private route: ActivatedRoute,
              private routes: Router
  ) { }

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
  initForm(): void {
    this.statusUpdateForm = this.formBuilder.group({
      status: ['', Validators.required]
    });
  }
  initStateData(): void {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.userData = data.allUser;
        this.currentUser = data.allUser?.find(user => this.id === user.id);
      })
    ).subscribe();
  }

  onUpdate(): void {
    this.submitted = true;
    this.userData.splice(this.userData.findIndex(getUser => getUser.email === this.currentUser.email), 1, {
    ...this.currentUser, ...this.statusUpdateForm.value})
    console.log(this.userData, this.currentUser);
    this.facadeService.updateUserState(this.userData);
    this.facadeService.updateAccount(this.statusUpdateForm.value, this.id)
    this.formMessage = 'Status successfully updated';
  }
  onBack(): void {
    this.routes.navigate(['../../detail'], {relativeTo: this.route})
  }
  onHandleError(): void {
    this.formMessage = null;
    this.routes.navigate(['../../detail'], {relativeTo: this.route})
  }

  get status(): AbstractControl {
    return this.statusUpdateForm.get('status');
  }
}
