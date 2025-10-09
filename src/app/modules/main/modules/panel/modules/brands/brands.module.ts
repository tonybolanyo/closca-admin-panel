import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsListComponent } from './components/brands-list/brands-list.component';
import { BrandsComponent } from './containers/brands/brands.component';
import { BrandsRoutingModule } from './brands-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
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
