import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { ChallengeSubscriptionsUsersListComponent } from './challenge-subscriptions-users-list.component';
import { ChallengeSubscriptionService } from 'src/app/shared/custom-gnommo-base/services';

describe('ChallengeSubscriptionsUsersListComponent', () => {
  let component: ChallengeSubscriptionsUsersListComponent;
  let fixture: ComponentFixture<ChallengeSubscriptionsUsersListComponent>;

  beforeEach(waitForAsync(() => {
    const mockChallengeSubscriptionService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0))
    };

    TestBed.configureTestingModule({
      imports: [ ChallengeSubscriptionsUsersListComponent, ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: ChallengeSubscriptionService, useValue: mockChallengeSubscriptionService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeSubscriptionsUsersListComponent);
    component = fixture.componentInstance;
    component.challengeId = 'test-id';
    component.role = 'ADMIN';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have filterForm initialized', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.filterForm.get('userName')).toBeDefined();
    expect(component.filterForm.get('email')).toBeDefined();
    expect(component.filterForm.get('challengeStatus')).toBeDefined();
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have challenge statuses initialized', () => {
    expect(component.challengeStatusses).toBeDefined();
    expect(component.challengeStatusses.length).toBeGreaterThan(0);
  });

  it('should initialize usersSubscribed as empty array', () => {
    expect(component.usersSubscribed).toEqual([]);
  });
});
