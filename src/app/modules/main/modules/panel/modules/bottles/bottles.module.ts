import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottlesListComponent } from './components/bottles-list/bottles-list.component';
import { BottleDetailComponent } from './components/bottle-detail/bottle-detail.component';
import { BottlesComponent } from './containers/bottles/bottles.component';
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
import { BottlesRoutingModule } from './bottles-routing.module';

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
    BottlesRoutingModule
  ],
  declarations: [
    BottlesListComponent, 
    BottleDetailComponent, 
    BottlesComponent]
})

export class BottlesModule { }
