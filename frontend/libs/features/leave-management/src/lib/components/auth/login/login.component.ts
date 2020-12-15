import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { AppliedLeave, Leave } from '../../../models/leave.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'frontend-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: User[];
  userLeave: Leave[];
  userAppliedLeave: AppliedLeave[];
  userLog: FormGroup;
  errorMessage = "";
  isLoggedIn = false;

  constructor(private routes: Router,
              public formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private facadeService: LeaveManagerFacadeService
  ) {}

  ngOnInit(): void {
    this.facadeService.initialize();
    this.initData();
    this.initForm();
  }
  initData(): void {
    this.facadeService.getAllAccounts()
      .subscribe(
        userData => this.userData = userData
      );
    this.facadeService.getAllLeave()
      .subscribe(
        userData => this.userLeave = userData
      );
    this.facadeService.getAllAppliedLeave()
      .subscribe(
        userData => this.userAppliedLeave = userData
      );
  }
  initForm(): void {
    this.userLog = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    this.facadeService.loginUser(this.userLog.value);
    this.facadeService.isLoggedIn$().pipe(
      delay(2000)
    ).subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );
    setTimeout(() => {
      if(this.isLoggedIn) {
        this.facadeService.storeAllDataToState(this.activeUser.id);
        this.routes.navigate(['user', this.activeUser.id, 'detail']);
      } else {
        this.errorMessage = 'Invalid credentials. Please try again';
      }
    }, 4000);
  }

  onRegister(): void {
    this.routes.navigate(['../register'], {relativeTo: this.route});
  }

  onHandleError(): void {
    this.errorMessage = null;
    this.userLog.reset();
  }

  get email(): AbstractControl {
    return this.userLog.get("email");
  }
  get password(): AbstractControl {
    return this.userLog.get("password");
  }
  get activeUser(): User {
    return this.userData.find(user => user.email === this.email.value);
  }
}
