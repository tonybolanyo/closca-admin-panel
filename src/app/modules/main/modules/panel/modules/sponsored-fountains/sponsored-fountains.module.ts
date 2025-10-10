import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsoredFountainsComponent } from './containers/sponsored-fountains/sponsored-fountains.component';
import { SponsoredFountainsListComponent } from './components/sponsored-fountains-list/sponsored-fountains-list.component';
import { SponsoredFountainDetailComponent } from './components/sponsored-fountain-detail/sponsored-fountain-detail.component';
import { SponsoredFountainsRoutingModule } from './sponsored-fountains-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
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
    GoogleMapsModule,
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
