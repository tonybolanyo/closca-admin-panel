import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { UserRateDetailComponent } from './user-rate-detail.component';
import { UserRatingsService } from 'src/app/shared/custom-gnommo-base/services';

describe('UserRateDetailComponent', () => {
  let component: UserRateDetailComponent;
  let fixture: ComponentFixture<UserRateDetailComponent>;

  beforeEach(waitForAsync(() => {
    const mockUserRatingsService = {
      getById: jest.fn().mockReturnValue(of({
        userInfo: { userName: 'test', email: 'test@test.com', phoneNumber: '123' },
        fountainInfo: { name: 'test fountain', address: { address: 'test address' }, fountainType: 'PUBLIC' },
        userId: '123',
        fountainId: '456'
      }))
    };

    const mockActivatedRoute = {
      snapshot: {
        params: { id: 'test-id' }
      }
    };

    TestBed.configureTestingModule({
      imports: [ UserRateDetailComponent, ReactiveFormsModule, FormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: Location, useValue: { back: jest.fn() } },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: UserRatingsService, useValue: mockUserRatingsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRateDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have userRateForm initialized', () => {
    expect(component.userRateForm).toBeDefined();
    expect(component.userRateForm.get('userInfo')).toBeDefined();
    expect(component.userRateForm.get('fountainInfo')).toBeDefined();
  });

  it('should have routerDefinitions', () => {
    expect(component.routerDefinitions).toBeDefined();
  });

  it('should have fountainTypeOptions', () => {
    expect(component.fountainTypeOptions).toBeDefined();
  });

  it('should initialize userRateId from route params', () => {
    expect(component.userRateId).toBe('test-id');
  });
});
