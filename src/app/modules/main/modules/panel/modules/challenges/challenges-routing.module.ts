import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';

import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { ChallengesComponent } from './containers/challenges/challenges.component';
import { ChallengesListComponent } from './components/challenges-list/challenges-list.component';
import { ChallengeDetailComponent } from './components/challenge-detail/challenge-detail.component';
import { ChallengeMetricsComponent } from './components/challenge-metrics/challenge-metrics.component';
import { ChallengesOrderComponent } from './components/challenges-order/challenges-order.component';

const routes: Routes = [
  {
    path: '',
    component: ChallengesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'prefix'
      },
      {
        path: 'list',
        component: ChallengesListComponent
      },
      {
        path: 'order',
        component: ChallengesOrderComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'view/:id',
        component: ChallengeDetailComponent,
      },
      {
        path: 'metrics/:id',
        component: ChallengeMetricsComponent,
      },
      {
        path: 'new',
        component: ChallengeDetailComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'edit/:id',
        component: ChallengeDetailComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengesRoutingModule {

}
