import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --> Components
import { PanelComponent } from './containers/panel/panel.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

// --> Routes
import { PanelRoutingModule } from './panel-routing.module';

// --> Angular material
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
    MatListModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    DateAdapter,
    MatDialogModule,
    MAT_DATE_FORMATS
} from '@angular/material';
import { MyDateAdapter } from '../../../../shared/services/datepicker-angular-material.service';

// --> External material
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/shared.module';
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { APP_DATE_FORMATS } from '../../../../shared/constants/date-formats';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        MatCardModule,
        MatDividerModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatDialogModule,
        MatIconModule,
        NgSelectModule,
        SharedModule,
        FileUploadModule,
        ReactiveFormsModule,
        ModalGalleryModule,
        PanelRoutingModule,
    ],
    exports: [],
    declarations: [
        PanelComponent,
        HomeComponent,
        SidebarComponent,
    ],
    providers: [
        {provide: DateAdapter, useClass: MyDateAdapter},
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        },
    ],
})
export class PanelModule { }
