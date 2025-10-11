import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BrandDetailComponent } from './brand-detail.component';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { AuthService } from '@tyris/angular-foundation';

describe('BrandDetailComponent', () => {
  let component: BrandDetailComponent;
  let fixture: ComponentFixture<BrandDetailComponent>;

  beforeEach(waitForAsync(() => {
    const mockBrandService = {
      getById: jest.fn().mockReturnValue(of({ data: {} })),
      create: jest.fn().mockReturnValue(of({ data: {} })),
      update: jest.fn().mockReturnValue(of({ data: {} }))
    };
    
    const mockFountainService = {
      getAll: jest.fn().mockReturnValue(of({ data: [] }))
    };

    TestBed.configureTestingModule({
      imports: [ BrandDetailComponent ],
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
        { provide: BrandService, useValue: mockBrandService },
        { provide: FountainService, useValue: mockFountainService },
        { provide: CanDeactivateDialogService, useValue: { canDeactivate: jest.fn() } },
        { provide: AuthService, useValue: { getToken: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
