import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { of } from 'rxjs';

import { SponsoredFountainDetailComponent } from './sponsored-fountain-detail.component';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { RefillService } from 'src/app/shared/custom-gnommo-base/services/refill.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { AuthService } from '@tyris/angular-foundation';

describe('SponsoredFountainDetailComponent', () => {
  let component: SponsoredFountainDetailComponent;
  let fixture: ComponentFixture<SponsoredFountainDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainDetailComponent ],
      imports: [ 
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        GoogleMapsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        UntypedFormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {}, url: [{ path: 'create' }] }
          } 
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: FountainService, useValue: { getById: jest.fn().mockReturnValue(of({})), create: jest.fn(), update: jest.fn(), count: jest.fn().mockReturnValue(of({ totalFountains: 0 })) } },
        { provide: RefillService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: CorporateService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: CanDeactivateDialogService, useValue: { canDeactivate: jest.fn() } },
        { provide: LoggedUserService, useValue: { getRole: jest.fn().mockReturnValue('ADMIN'), getCorporateId: jest.fn(), getLoggedUser: jest.fn().mockReturnValue(of({})) } },
        { provide: AuthService, useValue: { getToken: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: Location, useValue: { back: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
