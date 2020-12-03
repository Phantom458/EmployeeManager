import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../../models/user.model';
import { LeaveService } from '../../../misc/temp-files/leave.service';
import { passwordValidator } from '../../../misc/password.validator';
import { LeaveManagerApiService } from '../../../services/leave-manager-api.service';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';

@Component({
  selector: 'frontend-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  formMessage = '';
  private subscription: Subscription;

  id: number;
  userAuth: number = null;
  userData: User[];
  currentUser: User;

  statusList=['At Work', 'On Leave', 'Inactive'];

  constructor(private formBuilder: FormBuilder,
              private apiService: LeaveManagerApiService,
              private facadeService: LeaveManagerFacadeService,
              private leaveService: LeaveService,
              private routes: Router,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initialId();
    this.initialData();
  }
  initialId() {
    this.subscription = this.facadeService.checkUserExists().subscribe(
      id => {
        this.userAuth = id;
      },
      err => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.initForm();
        }
      )
  }
  initialData() {
    if (this.id) {
      this.facadeService.getAccountById(this.id)
        .subscribe(
          userData => this.currentUser = userData
        );
    } else {
      this.facadeService.getAllAccounts()
        .subscribe(
          userData => this.userData = userData
        );
    }
  }

  private initForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      status: ['']
    }, {validators: passwordValidator});
  }

  onRegister(){
    if (this.id == null && this.checkDupeEmail(this.email.value)) {
      this.formMessage = 'This email has already been registered. SignIn to continue';
    } else {
      this.submitted = true;
      (this.id > 1)? this.editSuccess() : this.registerSuccess()
    }
  }
  private registerSuccess() {
    this.submitted = true;
    this.facadeService.addAccount(this.signUpForm.value);
    this.formMessage = 'Registration successful! Please log in to continue';
  }
  private editSuccess() {
    this.submitted = true;
    this.signUpForm.get('status').setValue(this.currentUser.status);
    this.facadeService.updateUserState(this.signUpForm.value, this.id);
    this.formMessage = 'Your changes have been saved';
  }
  checkDupeEmail(email: string) {
    const dupeEmail = this.userData.find(user => user.email === email);
    if (dupeEmail) {
      return true;
    }
  }

  onSignIn() {
    this.routes.navigate(['../login'], {relativeTo: this.route})
  }
  onCancel() {
    this.routes.navigate(['../detail'], {relativeTo: this.route})
  }

  onHandleError() {
    this.formMessage = null;
    (this.id >= 1)? this.routes.navigate(['../detail'], {relativeTo: this.route})
      : this.routes.navigate(['auth/login']);
  }

  get status() {
    return this.signUpForm.get('status');
  }
  get email() {
    return this.signUpForm.get('email');
  }
}
