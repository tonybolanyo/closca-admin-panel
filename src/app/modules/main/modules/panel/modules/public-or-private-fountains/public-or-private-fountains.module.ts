import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainsListComponent } from './components/public-or-private-fountains-list/public-or-private-fountains-list.component';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainDetailComponent } from './components/public-or-private-fountain-detail/public-or-private-fountain-detail.component';
import { PublicOrPrivateFountainsComponent } from './containers/public-or-private-fountains/public-or-private-fountains.component';
import { PublicOrPrivateFountainsRoutingModule } from './public-or-private-fountains-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule,
         MatInputModule,
         MatTableModule,
         MatDatepickerModule,
         MatCardModule,
         MatIconModule,
         MatPaginatorModule,
         MatDialogModule,
         MatSelectModule,
         MatButtonToggleModule,
         MatCheckboxModule,
         MatOptionModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    PublicOrPrivateFountainsRoutingModule,
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
    FormsModule,
    NgxUiLoaderModule,
    AgmCoreModule,
    GooglePlaceModule,
    FileUploadModule,
    AngularEditorModule,
    MatDatepickerModule
  ],
  declarations: [
    PublicOrPrivateFountainsListComponent,
    PublicOrPrivateFountainDetailComponent,
    PublicOrPrivateFountainsComponent
  ]
})
export class PublicOrPrivateFountainsModule { }
