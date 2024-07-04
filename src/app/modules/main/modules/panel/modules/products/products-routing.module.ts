import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './containers/products/products.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: ProductsComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component: ProductsListComponent },
        {
          path: 'view/:id',
          component: ProductDetailComponent,
        },
        {
          path: 'new',
          component: ProductDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        },
        {
          path: 'edit/:id',
          component: ProductDetailComponent,
          canDeactivate: [CanDeactivateGuard]
        }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProductsRoutingModule {

  }
