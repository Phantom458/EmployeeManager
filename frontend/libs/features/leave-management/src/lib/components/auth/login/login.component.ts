import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AccountService } from '../../../misc/temp-files/account.service';
import { AuthService } from '../../../misc/temp-files/auth.service';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { delay } from 'rxjs/operators';
import { AppliedLeave, Leave } from '../../../models/leave.model';

@Component({
  selector: 'frontend-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: User[];
  userLeave: Leave[];
  userAppliedLeave: AppliedLeave[];
  private loginSuccess = false;
  userLog: FormGroup;
  errorMessage = "";

  constructor(private routes: Router,
              private authService: AuthService,
              public formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private accountService: AccountService,
              private facadeService: LeaveManagerFacadeService
  ) {}

  ngOnInit(): void {
    this.facadeService.initialize();
    this.initData();
    this.initForm();
  }
  initData() {
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
  initForm() {
    this.userLog = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  onLogin() {
    const user = this.activeUser;
    this.facadeService.loginUser(this.userLog.value);
    this.userLoggedIn();
    if(this.loginSuccess) {
      this.facadeService.storeAllDataToState(user.id);
      this.routes.navigate(['user', user.id, 'detail']);
    } else {
      this.errorMessage = 'Invalid credentials. Please try again'
    }
  }
  userLoggedIn(): void {
    this.facadeService.isLoggedIn().pipe(
      delay(3000)
    ).subscribe(
      value => this.loginSuccess = value
    )
  }

  onRegister(){
    this.routes.navigate(['../register'], {relativeTo: this.route});
  }

  onHandleError() {
    this.errorMessage = null;
    this.userLog.reset();
  }

  get email() {
    return this.userLog.get("email");
  }
  get password() {
    return this.userLog.get("password");
  }
  get activeUser() {
    return this.userData.find(user => user.email === this.email.value);
  }
}
