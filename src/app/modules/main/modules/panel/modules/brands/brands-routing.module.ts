import { Routes, RouterModule } from '@angular/router';
import { BrandsComponent } from './containers/brands/brands.component';
import { BrandsListComponent } from './components/brands-list/brands-list.component';
import { BrandDetailComponent } from './components/brand-detail/brand-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: BrandsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', component: BrandsListComponent },
            {
                path: 'new',
                component: BrandDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: BrandDetailComponent,
            },
            {
                path: 'edit/:id',
                component: BrandDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandsRoutingModule {

}
