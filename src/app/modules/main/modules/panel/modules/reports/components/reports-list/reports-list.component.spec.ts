import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ReportsListComponent } from './reports-list.component';
import { ReportService } from 'src/app/shared/custom-gnommo-base/services/reports.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('ReportsListComponent', () => {
  let component: ReportsListComponent;
  let fixture: ComponentFixture<ReportsListComponent>;

  beforeEach(waitForAsync(() => {
    const mockReportService = {
      getAll: jest.fn().mockReturnValue(of({ data: [] })),
      count: jest.fn().mockReturnValue(of({ count: 0 }))
    };
    
    const mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of({ data: [] }))
    };
    
    const mockLoggedUserService = {
      getRole: jest.fn().mockReturnValue('ADMIN'),
      getCorporateId: jest.fn().mockReturnValue('123')
    };

    TestBed.configureTestingModule({
      declarations: [ ReportsListComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: ReportService, useValue: mockReportService },
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
