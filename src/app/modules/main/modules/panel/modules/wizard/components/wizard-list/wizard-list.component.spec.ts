import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { WizardListComponent } from './wizard-list.component';
import { OnboardingService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

describe('WizardListComponent', () => {
  let component: WizardListComponent;
  let fixture: ComponentFixture<WizardListComponent>;

  beforeEach(waitForAsync(() => {
    const mockOnboardingService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0)),
      delete: jest.fn().mockReturnValue(of({}))
    };

    const mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of([]))
    };

    const mockLoggedUserService = {
      getRole: jest.fn().mockReturnValue('ADMIN'),
      getCorporateId: jest.fn().mockReturnValue('123')
    };

    TestBed.configureTestingModule({
      imports: [ WizardListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: OnboardingService, useValue: mockOnboardingService },
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct filter for ADMIN role', () => {
    expect(component.filter).toContain('"instance.status": "ACTIVE"');
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have sort configured', () => {
    expect(component.sort).toBe('instance.createAt');
  });

  it('should have tableReady property', () => {
    expect(component.tableReady).toBeDefined();
  });
});
