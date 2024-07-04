import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTypesListComponent } from './components/product-types-list/product-types-list.component';
import { ProductTypeDetailComponent } from './components/product-type-detail/product-type-detail.component';
import { ProductTypesComponent } from './containers/product-types/product-types.component';
import { ProductTypesRoutingModule } from './product-types-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatInputModule,
    ProductTypesRoutingModule
  ],
  declarations: [
    ProductTypesListComponent,
    ProductTypeDetailComponent,
    ProductTypesComponent
  ]
})
export class ProductTypesModule { }
