import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './containers/products/products.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { 
  MatTableModule,
  MatPaginatorModule,
  MatSelectModule,
  MatOptionModule,
  MatCheckboxModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatIconModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule, 
  MatButtonModule} from '@angular/material';
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
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductDetailComponent,
    ProductRedeemCodesListComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
],
})
export class ProductsModule { }
