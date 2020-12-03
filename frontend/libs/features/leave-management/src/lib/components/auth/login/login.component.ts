import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../models/user.model';
import { AccountService } from '../../../misc/temp-files/account.service';
import { AuthService } from '../../../misc/temp-files/auth.service';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';

@Component({
  selector: 'frontend-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userData: User[];

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
  }
  initData() {
    this.facadeService.getAllAccounts()
      .subscribe(
        userData => this.userData = userData
      );
    this.userLog = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  get email() {
    return this.userLog.get("email");
  }
  get password() {
    return this.userLog.get("password");
  }

  onLogin() {
    const correctUser = this.userData.find(user => user.email === this.email.value);
    const checkUser = this.userData.find(user => user.password === this.password.value);

    if (correctUser === checkUser) {
      this.facadeService.storeUserDataToState(correctUser.id);
      if(correctUser.id === 1) {
        this.routes.navigate(['user/list']);
      } else {
        this.routes.navigate(['user', correctUser.id, 'detail']);
      }
    } else {
      this.errorMessage = "Incorrect email or password";
    }
  }

  onRegister(){
    this.routes.navigate(['../register'], {relativeTo: this.route});
  }

  onHandleError() {
    this.errorMessage = null;
    this.userLog.reset();
  }
}
