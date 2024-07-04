import { Routes, RouterModule } from '@angular/router';
import { ProductTypesComponent } from './containers/product-types/product-types.component';
import { ProductTypesListComponent } from './components/product-types-list/product-types-list.component';
import { ProductTypeDetailComponent } from './components/product-type-detail/product-type-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: ProductTypesComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component: ProductTypesListComponent },
        {
          path: 'view/:id',
          component: ProductTypeDetailComponent,
        },
        {
          path: 'new',
          component: ProductTypeDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        },
        {
          path: 'edit/:id',
          component: ProductTypeDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProductTypesRoutingModule {

  }
