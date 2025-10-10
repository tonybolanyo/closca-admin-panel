import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { FountainsImpactListComponent } from './components/fountains-impact-list/fountains-impact-list.component';
// tslint:disable-next-line: max-line-length
import { FountainsImpactComponent } from './containers/fountains-impact/fountains-impact.component';
import { FountainsImpactRoutingModule } from './fountains-impact-routing.module';
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
import { GoogleMapsModule } from '@angular/google-maps';
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
    GoogleMapsModule,
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
