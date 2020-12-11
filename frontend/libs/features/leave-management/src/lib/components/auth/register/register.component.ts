import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { passwordValidator } from '../../../misc/validators/password.validator';
import { LeaveManagerApiService } from '../../../services/leave-manager-api.service';
import { LeaveManagerFacadeService } from '../../../services/leave-manager-facade.service';
import { LeaveManagerStoreState } from '../../../services/leave-manager-state.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'frontend-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  state$: Observable<LeaveManagerStoreState>;
  signUpForm: FormGroup;
  submitted = false;
  formMessage = '';
  id: number;
  isAdmin = false;
  isLoggedIn = false;
  userData: User[];
  currentUser: User;
  statusList=['At Work', 'On Leave', 'Inactive'];

  constructor(private formBuilder: FormBuilder,
              private apiService: LeaveManagerApiService,
              private facadeService: LeaveManagerFacadeService,
              private routes: Router,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initialId();
    this.initialData();
    this.initForm();
  }
  initialId() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      )
  }
  initialData() {
    this.facadeService.isAdmin$().subscribe(
      admin => this.isAdmin = admin
    );
    this.facadeService.isLoggedIn$().subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );
    if (!this.id) {
      this.facadeService.getAllAccounts()
        .subscribe(
          userData => this.userData = userData
        );
    } else {
      this.initStateData();
    }
  }
  initStateData() {
    this.state$ = this.facadeService.stateChanged();
    this.state$.pipe(
      tap(data => {
        this.userData = data.allUser;
        this.currentUser = data.allUser?.find(user => this.id === user.id);
      })
    ).subscribe();
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
    if (this.isLoggedIn === false && this.checkDupeEmail(this.email.value)) {
      this.formMessage = 'This email has already been registered. SignIn to continue';
    } else {
      (this.isLoggedIn === true)? this.editSuccess() : this.registerSuccess()
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
    this.userData?.splice(this.userData.findIndex(getUser => getUser.email === this.currentUser.email), 1, {
      ...this.signUpForm.value, id: this.id
    });
    this.facadeService.updateUserState(this.userData);
    this.facadeService.updateAccount(this.signUpForm.value, this.id)
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
    (this.isLoggedIn === true)? this.routes.navigate(['../detail'], {relativeTo: this.route})
      : this.routes.navigate(['auth/login']);
  }

  get status() {
    return this.signUpForm.get('status');
  }
  get email() {
    return this.signUpForm.get('email');
  }
}
