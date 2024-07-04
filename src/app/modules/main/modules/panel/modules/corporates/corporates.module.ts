import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --> Components
import { CorporatesComponent } from './containers/corporates/corporates.component';
import { CorporateDetailComponent } from './components/corporate-detail/corporate-detail.component';
import { CorporatesListComponent } from './components/corporates-list/corporates-list.component';

// --> Routes
import { CorporatesRoutingModule } from './corporates-routing.module';

// --> External libs
import {
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatOptionModule,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material';

// --> Services
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';

// --> Constants
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';


import { SharedModule } from 'src/app/shared/shared.module';
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatCardModule,
      MatDatepickerModule,
      MatIconModule,
      MatPaginatorModule,
      MatDialogModule,
      MatSelectModule,
      MatButtonToggleModule,
      MatOptionModule,
      SharedModule,
      ModalGalleryModule,
      FileUploadModule,
      ReactiveFormsModule,
      NgSelectModule,
      NgxUiLoaderModule,
      NgbModule,
      CorporatesRoutingModule

  ],
  declarations: [
    CorporatesComponent,
    CorporatesListComponent,
    CorporateDetailComponent],

  providers: [
      { provide: DateAdapter, useClass: MyDateAdapter },
      {
          provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
      }
  ]
})

export class CorporatesModule { }
