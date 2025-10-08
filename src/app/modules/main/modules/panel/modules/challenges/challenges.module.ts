import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// --> External libs
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesRoutingModule } from './challenges-routing.module';
import { MyDateAdapter } from 'src/app/shared/services/datepicker-angular-material.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { APP_DATE_FORMATS } from 'src/app/shared/constants/date-formats';
import { ChallengesComponent } from './containers/challenges/challenges.component';
import { ChallengesListComponent } from './components/challenges-list/challenges-list.component';
import { ChallengeDetailComponent } from './components/challenge-detail/challenge-detail.component';
import { ChallengeMetricsComponent } from './components/challenge-metrics/challenge-metrics.component';
// tslint:disable-next-line:max-line-length
import { ChallengeSubscriptionsUsersListComponent } from './components/challenge-subscriptions-users-list/challenge-subscriptions-users-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChallengesOrderComponent } from './components/challenges-order/challenges-order.component';

import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
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
        AngularEditorModule,
        ChallengesRoutingModule,
        MatCheckboxModule,
        NgApexchartsModule
    ],
    declarations: [
        ChallengesComponent,
        ChallengesListComponent,
        ChallengeSubscriptionsUsersListComponent,
        ChallengeMetricsComponent,
        ChallengeDetailComponent,
        ChallengesOrderComponent],

    providers: [
        { provide: DateAdapter, useClass: MyDateAdapter },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ChallengesModule { }
