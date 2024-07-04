import { Routes, RouterModule } from '@angular/router';
import { ExampleCrudComponent } from './containers/example-crud/example-crud.component';
import { ExampleCrudListComponent } from './components/example-crud-list/example-crud-list.component';
import { ExampleCrudDetailComponent } from './components/example-crud-detail/example-crud-detail.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: ExampleCrudComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix'},
        { path: 'list', component: ExampleCrudListComponent},
        { path: 'new', component: ExampleCrudDetailComponent},
        { path: 'view/:id', component: ExampleCrudDetailComponent},
        { path: 'edit/:id', component: ExampleCrudDetailComponent}
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExampleCrudRoutingModule {
  }
