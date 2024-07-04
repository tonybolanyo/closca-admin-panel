import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsListComponent } from './components/brands-list/brands-list.component';
import { BrandsComponent } from './containers/brands/brands.component';
import { BrandsRoutingModule } from './brands-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatButtonToggleModule, MatOptionModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { BrandDetailComponent } from './components/brand-detail/brand-detail.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatOptionModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    FileUploadModule,
    BrandsRoutingModule
  ],
  declarations: [
    BrandsListComponent,
    BrandDetailComponent,
    BrandsComponent
  ]
})
export class BrandsModule { }
