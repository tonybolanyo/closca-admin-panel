import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';
import { BottleTypesComponent } from './containers/bottle-types/bottle-types.component';
import { BottleTypesListComponent } from './components/bottle-types-list/bottle-types-list.component';
import { BottleTypeDetailComponent } from './components/bottle-type-detail/bottle-type-detail.component';

const routes: Routes = [
    {
        path: '',
        component: BottleTypesComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', component: BottleTypesListComponent },
            {
                path: 'new',
                component: BottleTypeDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: BottleTypeDetailComponent,
            },
            {
                path: 'edit/:id',
                component: BottleTypeDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BottleTypesRoutingModule {

}
