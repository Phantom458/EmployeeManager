import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedComponentsModule } from '@frontend/shared-components';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    SharedComponentsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
  ]
})
export class AuthModule { }
