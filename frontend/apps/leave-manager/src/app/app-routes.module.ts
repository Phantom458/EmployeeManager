import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  //Default Path
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  //Login and Register
  { path: 'auth', loadChildren: () => import('../../../../libs/features/leave-management/src/lib/components/auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutesModule { }
