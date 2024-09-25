import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile/profile.component';

import { authGuard } from './services/guards/auth-guard.guard';
import { AdminPanelComponent } from './adminProfile/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin/signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'admin/profile',
    component: AdminPanelComponent,
    canActivate: [authGuard],
  },
];
