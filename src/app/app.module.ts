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
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
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

// ng-gnommo-base - Angular 6 compatibility still being worked on
import { AngularFoundationModule } from '@tyris/angular-foundation';
import { CustomGnommoBaseModule } from './shared/custom-gnommo-base/custom-gnommo-base.module';

import { AgmCoreModule } from '@agm/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMultiLineEllipsisModule } from 'ngx-multi-line-ellipsis';
import { environment } from 'src/environments/environment';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';

@NgModule({
  imports: [
    NgApexchartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFoundationModule.forRoot(),
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
    GalleryModule,
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
