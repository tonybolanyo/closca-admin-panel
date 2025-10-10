import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { FountainsImpactListComponent } from './fountains-impact-list.component';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('FountainsImpactListComponent', () => {
  let component: FountainsImpactListComponent;
  let fixture: ComponentFixture<FountainsImpactListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FountainsImpactListComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: FountainService, useValue: { getAll: jest.fn().mockReturnValue(of({ data: [] })), count: jest.fn().mockReturnValue(of({ totalFountains: 0 })), getMetrics: jest.fn().mockReturnValue(of({})) } },
        { provide: CorporateService, useValue: { getAll: jest.fn().mockReturnValue(of({ data: [] })) } },
        { provide: BrandService, useValue: { getAll: jest.fn().mockReturnValue(of({ data: [] })) } },
        { provide: LoggedUserService, useValue: { getRole: jest.fn().mockReturnValue('ADMIN'), getCorporateId: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainsImpactListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
