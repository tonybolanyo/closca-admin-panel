import { Routes, RouterModule } from '@angular/router';
import { WizardComponent } from './containers/wizard/wizard.component';
import { WizardListComponent } from './components/wizard-list/wizard-list.component';
import { WizardDetailComponent } from './components/wizard-detail/wizard-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: WizardComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component:WizardListComponent },
        {
          path: 'view/:id',
          component: WizardDetailComponent,
        },
        {
          path: 'new',
          component: WizardDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        },
        {
          path: 'edit/:id',
          component: WizardDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WizardRoutingModule {

  }
