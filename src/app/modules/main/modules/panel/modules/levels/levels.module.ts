import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsListComponent } from './components/levels-list/levels-list.component';
import { LevelDetailComponent } from './components/level-detail/level-detail.component';
import { LevelsComponent } from './containers/levels/levels.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatIconModule, MatPaginatorModule, MatDialogModule, MatSelectModule, MatButtonToggleModule, MatOptionModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FileUploadModule } from 'ng2-file-upload';
import { LevelsRoutingModule } from './levels-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
    MatButtonToggleModule,
    MatOptionModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    FileUploadModule,
    LevelsRoutingModule,
    AngularEditorModule
  ],
  declarations: [
    LevelsListComponent, 
    LevelDetailComponent, 
    LevelsComponent]
})

export class LevelsModule { }
