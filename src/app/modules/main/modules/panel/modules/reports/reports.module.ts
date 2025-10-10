import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';
import { ReportsComponent } from './containers/reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FileUploadModule } from 'ng2-file-upload';
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';

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
    FileUploadModule,
    ReportsRoutingModule,
    GoogleMapsModule,
    FormsModule
  ],
  declarations: [
    ReportsComponent,
    ReportsListComponent,
    ReportDetailComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
],
})
export class ReportsModule { }
