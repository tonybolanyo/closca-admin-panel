import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { UsersListComponent } from './users-list.component';
import { UserService, CorporateService, LevelService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  beforeEach(waitForAsync(() => {
    const mockUserService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0)),
      delete: jest.fn().mockReturnValue(of({}))
    };

    const mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of([]))
    };

    const mockLevelService = {
      getAll: jest.fn().mockReturnValue(of([]))
    };

    const mockLoggedUserService = {
      getRole: jest.fn().mockReturnValue('ADMIN'),
      getCorporateId: jest.fn().mockReturnValue('123')
    };

    TestBed.configureTestingModule({
      imports: [ UsersListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: UserService, useValue: mockUserService },
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LevelService, useValue: mockLevelService },
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct filter for ADMIN role', () => {
    expect(component.filter).toContain('"role": "USER"');
    expect(component.filter).toContain('"instance.status": {$ne: "DELETED"}');
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have sort configured', () => {
    expect(component.sort).toBe('instance.createdAt');
  });
});
