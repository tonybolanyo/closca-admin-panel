import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsoredFountainsComponent } from './containers/sponsored-fountains/sponsored-fountains.component';
import { SponsoredFountainsListComponent } from './components/sponsored-fountains-list/sponsored-fountains-list.component';
import { SponsoredFountainDetailComponent } from './components/sponsored-fountain-detail/sponsored-fountain-detail.component';
import { SponsoredFountainsRoutingModule } from './sponsored-fountains-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatButtonModule, MatOptionModule, MatCheckboxModule, MatButtonToggleModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FileUploadModule } from 'ng2-file-upload';
import { SponsoredFountainCreateComponent } from './components/sponsored-fountain-create/sponsored-fountain-create.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatTableModule,
    AgmCoreModule,
    GooglePlaceModule,
    NgxUiLoaderModule,
    MatButtonToggleModule,
    FormsModule,
    FileUploadModule,
    NgSelectModule,
    SponsoredFountainsRoutingModule
  ],
  declarations: [
    SponsoredFountainsListComponent,
    SponsoredFountainDetailComponent,
    SponsoredFountainsComponent,
    SponsoredFountainCreateComponent
  ]
})
export class SponsoredFountainsModule { }
