import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottleTypesListComponent } from './components/bottle-types-list/bottle-types-list.component';
import { BottleTypeDetailComponent } from './components/bottle-type-detail/bottle-type-detail.component';
import { BottleTypesComponent } from './containers/bottle-types/bottle-types.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FileUploadModule } from 'ng2-file-upload';
import { BottleTypesRoutingModule } from './bottle-types-routing.module';

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
    BottleTypesRoutingModule
  ],
  declarations: [
    BottleTypesListComponent, 
    BottleTypeDetailComponent, 
    BottleTypesComponent]
})

export class BottleTypesModule { }
