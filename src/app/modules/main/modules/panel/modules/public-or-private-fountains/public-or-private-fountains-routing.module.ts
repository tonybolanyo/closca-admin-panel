import { Routes, RouterModule } from '@angular/router';
import { PublicOrPrivateFountainsComponent } from './containers/public-or-private-fountains/public-or-private-fountains.component';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainsListComponent } from './components/public-or-private-fountains-list/public-or-private-fountains-list.component';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainDetailComponent } from './components/public-or-private-fountain-detail/public-or-private-fountain-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: PublicOrPrivateFountainsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix'},
            { path: 'list', component: PublicOrPrivateFountainsListComponent },
            {
                path: 'new',
                component: PublicOrPrivateFountainDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: PublicOrPrivateFountainDetailComponent,
            },
            {
                path: 'edit/:id',
                component: PublicOrPrivateFountainDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicOrPrivateFountainsRoutingModule {

}
