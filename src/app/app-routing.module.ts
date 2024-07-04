import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// --> Components
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoggedUserGuard } from './shared/guards/logged-user.guard';
import { RegisterComponent } from './components/register/register.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: './modules/main/main.module#MainModule',
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoggedUserGuard]
  },
  {
    path: '**',
    redirectTo: 'admin'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
