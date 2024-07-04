import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';

// -> Components
import { UserRateComponent } from './containers/user-rate/user-rate.component';
import { UserRateListComponent } from './components/user-rate-list/user-rate-list.component';
import { UserRateDetailComponent } from './components/user-rate-detail/user-rate-detail.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: UserRateComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component: UserRateListComponent },
        {
          path: 'view/:id',
          component: UserRateDetailComponent,
        },
        {
          path: 'new',
          component: UserRateDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        },
        {
          path: 'edit/:id',
          component: UserRateDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserRateRoutingModule {

  }
