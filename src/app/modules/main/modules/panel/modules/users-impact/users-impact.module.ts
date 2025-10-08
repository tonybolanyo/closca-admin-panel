import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --> Components
import { UsersComponent } from './containers/users/users.component';
import { UsersImpactComponent } from './components/users-impact/users-impact.component';

// --> Routes
import { UsersImpactRoutingModule } from './users-impact-routing.module';


// --> External libs
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

// --> Services
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';

// --> Constants
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';


import { SharedModule } from 'src/app/shared/shared.module';
import { GalleryModule } from '@ks89/angular-modal-gallery';
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
        GalleryModule,
        FileUploadModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxUiLoaderModule,
        NgbModule,
        UsersImpactRoutingModule

    ],
    declarations: [
        UsersComponent,
        UsersImpactComponent],

    providers: [
        { provide: DateAdapter, useClass: MyDateAdapter },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class UsersModule { }
