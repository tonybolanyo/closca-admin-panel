import { Routes, RouterModule } from '@angular/router';
import { FountainsImpactComponent } from './containers/fountains-impact/fountains-impact.component';
// tslint:disable-next-line: max-line-length
import { FountainsImpactListComponent } from './components/fountains-impact-list/fountains-impact-list.component';
// tslint:disable-next-line: max-line-length
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: FountainsImpactComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix'},
            { path: 'list', component: FountainsImpactListComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FountainsImpactRoutingModule {

}
