import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';
import { BottlesComponent } from './containers/bottles/bottles.component';
import { BottlesListComponent } from './components/bottles-list/bottles-list.component';
import { BottleDetailComponent } from './components/bottle-detail/bottle-detail.component';

const routes: Routes = [
    {
        path: '',
        component: BottlesComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', component: BottlesListComponent },
            {
                path: 'new',
                component: BottleDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: BottleDetailComponent,
            }
            // ,
            // {
            //     path: 'edit/:id',
            //     component: BottleDetailComponent,
            //     canDeactivate: [CanDeactivateGuard]
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BottlesRoutingModule {

}
