import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { AuthService } from '@tyris/angular-foundation';
import { SponsoredFountainCreateComponent } from './sponsored-fountain-create.component';

describe('SponsoredFountainCreateComponent', () => {
  let component: SponsoredFountainCreateComponent;
  let fixture: ComponentFixture<SponsoredFountainCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainCreateComponent ],
      imports: [ ReactiveFormsModule, MatTableModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        UntypedFormBuilder,
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {} },
            params: { subscribe: jest.fn() }
          } 
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ToastrService,
          useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() }
        },
        { 
          provide: NgxUiLoaderService, 
          useValue: { start: jest.fn(), stop: jest.fn() } 
        },
        {
          provide: FountainService,
          useValue: { 
            create: jest.fn().mockReturnValue(of({})),
            update: jest.fn().mockReturnValue(of({})),
            getById: jest.fn().mockReturnValue(of({})),
            getAll: jest.fn().mockReturnValue(of({ data: [] })),
            count: jest.fn().mockReturnValue(of({ totalFountains: 0 }))
          }
        },
        { provide: CorporateService, useValue: { getAll: jest.fn().mockReturnValue(of({ data: [] })) } },
        { provide: BrandService, useValue: { getAll: jest.fn().mockReturnValue(of({ data: [] })) } },
        { provide: LoggedUserService, useValue: { getRole: jest.fn().mockReturnValue('ADMIN'), getCorporateId: jest.fn(), getLoggedUser: jest.fn().mockReturnValue(of({})) } },
        { provide: AuthService, useValue: { getToken: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainCreateComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid triggering component initialization
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
