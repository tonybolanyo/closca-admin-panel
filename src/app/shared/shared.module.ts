import { NgModule } from '@angular/core';
import { DialogConfirmationComponent } from './components/dialog-confirmation/dialog-confirmation.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { 
// tslint:disable-next-line: max-line-length
MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { SafePipe } from './pipes/safe.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookiesComponent } from './components/cookies/cookies.component';
import { CustomGalleryComponent } from './components/custom-gallery/custom-gallery.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CanDeactivateDialogService } from './services/can-deactivate-dialog.service';
// tslint:disable-next-line: max-line-length
import { TransformSponsoredFountainToPrivateComponent } from './components/transform-sponsored-fountain-to-private/transform-sponsored-fountain-to-private.component';
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
        // Import standalone components
        DialogConfirmationComponent,
        ChallengeCsvResponseDialogComponent,
        TransformSponsoredFountainToPrivateComponent,
        ChangeFountainStatusComponent,
        DialogInfoComponent,
        DialogRewardCodesComponent,
        CookiesComponent,
        CustomGalleryComponent,
        CustomTableComponent,
        ChangeProductStatusComponent
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
        SafePipe
    ],
    providers: [
        CanDeactivateDialogService
    ]
})
export class SharedModule {
}
