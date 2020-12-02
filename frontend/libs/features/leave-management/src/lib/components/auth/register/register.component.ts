import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../../models/user.model';
import { AuthService } from '../../../misc/temp-files/auth.service';
import { AccountService } from '../../../misc/temp-files/account.service';
import { LeaveService } from '../../../misc/temp-files/leave.service';
import { passwordValidator } from '../../../misc/password.validator';
import { LeaveManagerApiService } from '../../../services/leave-manager-api.service';
import { Leave } from '../../../models/leave.model';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';

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
  leaveValues: Leave;

  statusList=['At Work', 'On Leave', 'Inactive'];

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private apiService: LeaveManagerApiService,
              private facadeService: LeaveManagerFacadeService,
              private leaveService: LeaveService,
              private authService: AuthService,
              private routes: Router,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initData();
  }
  initData() {
    this.facadeService.getAllAccounts()
      .subscribe(
        userData => this.userData = userData
      );
    this.subscription = this.authService.checkRole().subscribe(
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
  get status() {
    return this.signUpForm.get('status');
  }
  get email() {
    return this.signUpForm.get('email');
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
    if (this.userAuth == null && this.checkDupeEmail(this.email.value)) {
      this.formMessage = 'This email has already been registered. SignIn to continue';
    } else {
      this.submitted = true;
      if(this.id < 1) {
        this.submitted = true;
        this.accountService.updateAccount(this.signUpForm.value, this.id);
        this.formMessage = 'Your changes have been saved';
      }
      else {
        this.submitted = true;
        this.facadeService.addAccount(this.signUpForm.value);
        this.formMessage = 'Registration successful! Please log in to continue';
      }
    }
  }
  checkDupeEmail(email: string) {
    const dupeEmail = this.userData.find(user => user.email === email);
    if (dupeEmail) {
      return true;
    }
  }

  onBack() {
    this.routes.navigate(['../login'], {relativeTo: this.route})
  }
  onCancel() {
    this.routes.navigate(['../../account/', this.id, 'detail'], {relativeTo: this.route})
  }

  onHandleError() {
    this.formMessage = null;
    this.routes.navigate(['../login'], {relativeTo: this.route});
    // if(this.id >= 1) {
    //   this.routes.navigate(['login-signup/account', this.id, 'detail'])
    // } else {
    //   this.routes.navigate(['login-signUp/login']);
    // }
  }
}
