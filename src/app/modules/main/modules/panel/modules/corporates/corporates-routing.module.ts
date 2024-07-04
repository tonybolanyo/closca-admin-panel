import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CorporatesComponent } from './containers/corporates/corporates.component';
import { CorporateDetailComponent } from './components/corporate-detail/corporate-detail.component';
import { CorporatesListComponent } from './components/corporates-list/corporates-list.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: CorporatesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'prefix' },
      { path: 'list', component: CorporatesListComponent },
      {
        path: 'new',
        component: CorporateDetailComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'view/:id',
        component: CorporateDetailComponent,
      },
      {
        path: 'edit/:id',
        component: CorporateDetailComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporatesRoutingModule {
}