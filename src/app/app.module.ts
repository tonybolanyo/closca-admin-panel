import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// --> Components
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// --> Routes
import { AppRoutingModule } from './app-routing.module';

// --> External libraries
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { LoggedUserGuard } from './shared/guards/logged-user.guard';
import { LoggedUserService } from './shared/services/logged-user.service';
import { SharedModule } from './shared/shared.module';

// --> Angular modal gallery
import { GalleryModule } from '@ks89/angular-modal-gallery';
import 'mousetrap';
// --> Angular Material
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FileUploadModule } from 'ng2-file-upload';

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

// ng-gnommo-base - Angular 6 compatibility still being worked on
import { AngularFoundationModule } from '@tyris/angular-foundation';
import { CustomGnommoBaseModule } from './shared/custom-gnommo-base/custom-gnommo-base.module';

import { GoogleMapsModule } from '@angular/google-maps';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';

@NgModule({
  imports: [
    NgApexchartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFoundationModule.forRoot(), // Angular 6 compatibility still being worked on
    CustomGnommoBaseModule,
    NgbModule,
    MatButtonModule,
    MatCardModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    FormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        // disableTimeOut: true,
        progressBar: true,
        timeOut: 3000,
        progressAnimation: 'increasing',
        positionClass: 'toast-custom',
        preventDuplicates: true,
      }
    ),
    GalleryModule,
    SharedModule,
    AppRoutingModule,
    AngularEditorModule,
    GoogleMapsModule,
    NgxUiLoaderModule,
    AppComponent,
    LoginComponent,
    PasswordRecoverComponent,
    ResetPasswordComponent,
    LandingPageComponent,
    RegisterComponent
  ],
  providers: [LoggedUserService, LoggedUserGuard, CanDeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
