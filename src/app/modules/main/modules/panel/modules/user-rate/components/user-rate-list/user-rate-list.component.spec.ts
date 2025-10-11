import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { UserRateListComponent } from './user-rate-list.component';
import { UserRatingsService } from 'src/app/shared/custom-gnommo-base/services';

describe('UserRateListComponent', () => {
  let component: UserRateListComponent;
  let fixture: ComponentFixture<UserRateListComponent>;

  beforeEach(waitForAsync(() => {
    const mockUserRatingsService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0))
    };

    TestBed.configureTestingModule({
      imports: [ UserRateListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: UserRatingsService, useValue: mockUserRatingsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRateListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have filter initialized', () => {
    expect(component.filter).toContain('"instance.status": "ACTIVE"');
  });

  it('should have table config defined', () => {
    expect(component.tableConfig).toBeDefined();
    expect(component.tableConfig.filterColumnEnabled).toBe(true);
    expect(component.tableConfig.paginatorExists).toBe(true);
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have sort configured', () => {
    expect(component.sort).toBe('-instance.createdAt');
  });
});
