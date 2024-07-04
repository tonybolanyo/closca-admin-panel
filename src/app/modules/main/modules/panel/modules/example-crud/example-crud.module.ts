import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --> Components
import { ExampleCrudComponent } from './containers/example-crud/example-crud.component';
import { ExampleCrudListComponent } from './components/example-crud-list/example-crud-list.component';
import { ExampleCrudDetailComponent } from './components/example-crud-detail/example-crud-detail.component';
// --> Routes
import { ExampleCrudRoutingModule } from './example-crud-routing.module';

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
        NgbModule,
        ExampleCrudRoutingModule

    ],
    declarations: [
        ExampleCrudComponent,
        ExampleCrudListComponent,
        ExampleCrudDetailComponent],

    providers: [
        { provide: DateAdapter, useClass: MyDateAdapter },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ExampleCrudModule { }
