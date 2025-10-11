import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './containers/products/products.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';
import { FileUploadModule } from 'ng2-file-upload';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProductRedeemCodesListComponent } from './components/product-redeem-codes-list/product-redeem-codes-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AngularEditorModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    NgxUiLoaderModule,
    SharedModule,
    FileUploadModule,
    ProductsRoutingModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
],
})
export class ProductsModule { }
