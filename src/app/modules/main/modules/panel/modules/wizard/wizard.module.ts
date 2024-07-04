import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardListComponent } from './components/wizard-list/wizard-list.component';
import { WizardDetailComponent } from './components/wizard-detail/wizard-detail.component';
import { WizardComponent } from './containers/wizard/wizard.component';
import { WizardRoutingModule } from './wizard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonToggleModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    AngularEditorModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FileUploadModule,
    WizardRoutingModule
  ],
  declarations: [
    WizardListComponent,
    WizardDetailComponent,
    WizardComponent
  ]
})
export class WizardModule { }
