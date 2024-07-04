import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';
import { ReportsComponent } from './containers/reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatButtonToggleModule, MatOptionModule, MatCheckboxModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

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
    AgmCoreModule,
    GooglePlaceModule,
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
