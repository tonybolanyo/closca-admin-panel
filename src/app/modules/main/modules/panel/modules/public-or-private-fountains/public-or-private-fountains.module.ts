import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainsListComponent } from './components/public-or-private-fountains-list/public-or-private-fountains-list.component';
// tslint:disable-next-line: max-line-length
import { PublicOrPrivateFountainDetailComponent } from './components/public-or-private-fountain-detail/public-or-private-fountain-detail.component';
import { PublicOrPrivateFountainsComponent } from './containers/public-or-private-fountains/public-or-private-fountains.component';
import { PublicOrPrivateFountainsRoutingModule } from './public-or-private-fountains-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { AgmCoreModule } from '@agm/core';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
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
    // AgmCoreModule, // Not compatible with Angular 20
    // GooglePlaceModule, // Not compatible with Angular 20
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
