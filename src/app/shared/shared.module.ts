import { NgModule } from '@angular/core';
import { DialogConfirmationComponent } from './components/dialog-confirmation/dialog-confirmation.component';
import {
    MatDialogModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatInputModule, MatDatepickerModule,
// tslint:disable-next-line: max-line-length
    MatFormFieldModule, MatSelectModule, MatOptionModule, MatIconModule, MatBottomSheetModule, MatPaginatorModule, MatTableModule, MatSortModule, MatCheckboxModule
} from '@angular/material';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { SafePipe } from './pipes/safe.pipe';
import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';
import { CommonModule } from '../../../node_modules/@angular/common';
import { CookiesComponent } from './components/cookies/cookies.component';
import { CustomGalleryComponent } from './components/custom-gallery/custom-gallery.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CanDeactivateDialogService } from './services/can-deactivate-dialog.service';
// tslint:disable-next-line: max-line-length
import { TransformSponsoredFountainToPrivateComponent } from './components/transform-sponsored-fountain-to-private/transform-sponsored-fountain-to-private.component';
import { NgxMultiLineEllipsisModule } from 'ngx-multi-line-ellipsis';
import { ChangeFountainStatusComponent } from './components/change-fountain-status/change-fountain-status.component';
import { ChangeProductStatusComponent } from './components/change-product-status/change-product-status.component';
import { DialogRewardCodesComponent } from './components/dialog-reward-codes/dialog-reward-codes.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengeCsvResponseDialogComponent } from './components/challenge-csv-response-dialog/challenge-csv-response-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatFormFieldModule,
        MatBottomSheetModule,
        MatOptionModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        FileUploadModule,
        NgbRatingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMultiLineEllipsisModule
    ],
    exports: [
        DialogConfirmationComponent,
        ChallengeCsvResponseDialogComponent,
        TransformSponsoredFountainToPrivateComponent,
        ChangeFountainStatusComponent,
        DialogInfoComponent,
        DialogRewardCodesComponent,
        SafePipe,
        CustomGalleryComponent,
        CustomTableComponent
    ],
    declarations: [
        DialogConfirmationComponent,
        ChallengeCsvResponseDialogComponent,
        DialogInfoComponent,
        SafePipe,
        CookiesComponent,
        CustomGalleryComponent,
        CustomTableComponent,
        TransformSponsoredFountainToPrivateComponent,
        ChangeFountainStatusComponent,
        ChangeProductStatusComponent,
        DialogRewardCodesComponent
    ],
    providers: [
        CanDeactivateDialogService
    ],
    entryComponents: [
        DialogConfirmationComponent,
        ChallengeCsvResponseDialogComponent,
        TransformSponsoredFountainToPrivateComponent,
        ChangeFountainStatusComponent,
        ChangeProductStatusComponent,
        DialogInfoComponent,
        DialogRewardCodesComponent,
        CookiesComponent
    ]
})
export class SharedModule {
}
