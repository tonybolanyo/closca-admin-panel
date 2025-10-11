import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTypesListComponent } from './components/product-types-list/product-types-list.component';
import { ProductTypeDetailComponent } from './components/product-type-detail/product-type-detail.component';
import { ProductTypesComponent } from './containers/product-types/product-types.component';
import { ProductTypesRoutingModule } from './product-types-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  ]
})
export class ProductTypesModule { }
