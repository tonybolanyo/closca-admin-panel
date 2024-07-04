import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { FountainsImpactListComponent } from './components/fountains-impact-list/fountains-impact-list.component';
// tslint:disable-next-line: max-line-length
import { FountainsImpactComponent } from './containers/fountains-impact/fountains-impact.component';
import { FountainsImpactRoutingModule } from './fountains-impact-routing.module';
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
    FountainsImpactRoutingModule,
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
    FountainsImpactListComponent,
    FountainsImpactComponent
  ]
})
export class FountainsImpactModule { }
