import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { UsersComponent } from './containers/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      { path: 'list', component: UsersListComponent },
      {
        path: 'view/:id',
        component: UserDetailComponent,
      },
      {
        path: 'edit/:id',
        component: UserDetailComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
