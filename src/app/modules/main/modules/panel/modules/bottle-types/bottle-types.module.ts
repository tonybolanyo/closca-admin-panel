import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottleTypesListComponent } from './components/bottle-types-list/bottle-types-list.component';
import { BottleTypeDetailComponent } from './components/bottle-type-detail/bottle-type-detail.component';
import { BottleTypesComponent } from './containers/bottle-types/bottle-types.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatButtonToggleModule, MatOptionModule, MatCheckboxModule } from '@angular/material';
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
