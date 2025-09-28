import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// --> Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoverComponent } from './components/password-recover/password-recover.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterComponent } from './components/register/register.component';

// --> Routes
import { AppRoutingModule } from './app-routing.module';

// --> External libraries
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { LoggedUserService } from './shared/services/logged-user.service';
import { LoggedUserGuard } from './shared/guards/logged-user.guard';
import { SharedModule } from './shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

// --> Angular modal gallery
import 'hammerjs';
import 'mousetrap';
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
// --> Angular Material
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule,
  MatInputModule, MatBottomSheetModule, MatCheckboxModule,
  MatExpansionModule, MatOptionModule, MatSelectModule
} from '@angular/material';

import { FileUploadModule } from 'ng2-file-upload';

import { NgApexchartsModule } from 'ng-apexcharts';

// ng-gnommo-base - Angular 6 compatibility still being worked on
// import { AngularFoundationModule } from '@tyris/angular-foundation-libs';
import { CustomGnommoBaseModule } from './shared/custom-gnommo-base/custom-gnommo-base.module';

import { NgxMultiLineEllipsisModule } from 'ngx-multi-line-ellipsis';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    NgApexchartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    // AngularFoundationModule.forRoot({}), // Angular 6 compatibility still being worked on
    CustomGnommoBaseModule,
    NgbModule.forRoot(),
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
    NgxUiLoaderModule,
    FileUploadModule,
    NgxMultiLineEllipsisModule,
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
    ModalGalleryModule.forRoot(),
    SharedModule,
    AppRoutingModule,
    AngularEditorModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
       libraries: ['places']
   })
  ],
  declarations: [
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
