import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/owner-layout/owner-layout.component';
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component'

const routes: Routes =[
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ResetPwdComponent },
  { path: 'activate-account', component: ResetPwdComponent },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/owner-layout/owner-layout.module#AdminLayoutModule',
      canActivate: [AuthGuard]
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash:false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
