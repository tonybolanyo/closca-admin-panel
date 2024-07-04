import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { UsersComponent } from './containers/users/users.component';
import { UsersImpactComponent } from './components/users-impact/users-impact.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      { path: 'list', component: UsersImpactComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersImpactRoutingModule {
}
