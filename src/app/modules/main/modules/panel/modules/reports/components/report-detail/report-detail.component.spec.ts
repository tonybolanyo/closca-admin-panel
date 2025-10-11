import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { of } from 'rxjs';

import { ReportDetailComponent } from './report-detail.component';
import { ReportService } from 'src/app/shared/custom-gnommo-base/services/reports.service';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('ReportDetailComponent', () => {
  let component: ReportDetailComponent;
  let fixture: ComponentFixture<ReportDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ReportDetailComponent ],
      imports: [ ReactiveFormsModule, MatButtonToggleModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        UntypedFormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {}, url: [{ path: 'view' }] }
          } 
        },
        { provide: ReportService, useValue: { getById: jest.fn().mockReturnValue(of({})) } },
        { provide: FountainService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: CorporateService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: LoggedUserService, useValue: { getRole: jest.fn().mockReturnValue('ADMIN'), getCorporateId: jest.fn() } },
        { provide: Location, useValue: { back: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
