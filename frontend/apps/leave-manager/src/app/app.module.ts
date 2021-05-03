import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedComponentsModule } from '@frontend/shared-components';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AppRoutesModule } from './app-routes.module';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { LeaveManagerInterceptorService } from '../../../../libs/features/leave-management/src/lib/services/leave-manager-interceptor.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {PortalModule} from '@angular/cdk/portal';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutesModule,
    HttpClientModule,
    SharedComponentsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('access_token');},
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['http://localhost:5000/auth/login']
      }
    }),
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    PortalModule,
    MatTooltipModule
  ],

  exports: [NavBarComponent],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LeaveManagerInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
