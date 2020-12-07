import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { AuthGuard } from '../../../../libs/features/leave-management/src/lib/misc/guards/auth.guard';

const appRoutes: Routes = [
  //Default Path
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  //Login and Register
  { path: 'auth', loadChildren: () => import('../../../../libs/features/leave-management/src/lib/components/auth/auth.module').then(m => m.AuthModule), },

  //Account
  { path: 'user', loadChildren: () => import('../../../../libs/features/leave-management/src/lib/components/account/account.module').then(m => m.AccountModule),
    canActivate: [AuthGuard]
  },
  //Leave
  { path: 'leave', loadChildren: () => import('../../../../libs/features/leave-management/src/lib/components/leave/leave.module').then(m => m.LeaveModule),
    canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutesModule { }
