import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

// --> Components
import { MainComponent } from './containers/main/main.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';

const routes: Routes = [
    {
      path: '',
      component: MainComponent,
      children: [
        {
          path: '',
          redirectTo: 'panel'
        },
        {
        path: 'panel',
        loadChildren: './modules/panel/panel.module#PanelModule',
        canActivate: [AuthGuard]
        },
        {
          path: 'user-profile',
          component: UserProfileComponent,
          canActivate: [AuthGuard],
          canDeactivate: [CanDeactivateGuard]
        }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MainRoutingModule {
  }
