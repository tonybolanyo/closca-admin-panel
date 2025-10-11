import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomFountainImagesComponent } from './containers/random-fountain-images/random-fountain-images.component';
import { RandomFountainImagesRoutingModule } from './random-fountain-images-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    MatDialogModule,
    SharedModule,
    RandomFountainImagesRoutingModule
  ]
})
export class RandomFountainImagesModule { }
