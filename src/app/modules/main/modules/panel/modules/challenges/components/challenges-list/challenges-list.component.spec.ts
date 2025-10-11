import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ChallengesListComponent } from './challenges-list.component';
import { ChallengeService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

describe('ChallengesListComponent', () => {
  let component: ChallengesListComponent;
  let fixture: ComponentFixture<ChallengesListComponent>;

  beforeEach(waitForAsync(() => {
    const mockChallengeService = {
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

    const mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({}))
      })
    };

    TestBed.configureTestingModule({
      imports: [ ChallengesListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have challenge statuses initialized', () => {
    expect(component.challengeStatus).toBeDefined();
    expect(component.challengeStatus.length).toBeGreaterThan(0);
  });

  it('should have challenge types initialized', () => {
    expect(component.challengeTypes).toBeDefined();
    expect(component.challengeTypes.length).toBeGreaterThan(0);
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });
});
