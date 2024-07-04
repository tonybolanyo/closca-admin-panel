import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// --> Routes
import { MainRoutingModule } from './main-routing.module';

// --> Components
import { MainComponent } from './containers/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// --> External libraries
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DateAdapter,
    MAT_DATE_FORMATS,
    MatCardModule
} from '@angular/material';
import { MyDateAdapter } from '../../shared/services/datepicker-angular-material.service';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { APP_DATE_FORMATS } from '../../shared/constants/date-formats';
import { FileUploadModule } from 'ng2-file-upload';
import { UserProfileComponent } from './components/user-profile/user-profile.component';



@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        MatCardModule,
        FormsModule,
        FileUploadModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatIconModule,
        ReactiveFormsModule,
        MainRoutingModule
    ],
    exports: [],
    declarations: [
        MainComponent,
        HeaderComponent,
        FooterComponent,
        UserProfileComponent
    ],
    providers: [
        { provide: DateAdapter, useClass: MyDateAdapter },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        },
        AuthGuard
    ],
})
export class MainModule { }
