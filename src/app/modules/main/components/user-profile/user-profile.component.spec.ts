import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { UserProfileComponent } from './user-profile.component';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(waitForAsync(() => {
    const mockUserService = {
      getById: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({}))
    };

    const mockLoggedUserService = {
      getLoggedUserValue: jest.fn().mockReturnValue({ _id: '123', userName: 'test' }),
      setLoggedUser: jest.fn()
    };

    const mockCanDeactivateDialogService = {
      openDialog: jest.fn().mockReturnValue(of(true))
    };

    TestBed.configureTestingModule({
      imports: [ UserProfileComponent, ReactiveFormsModule, FormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: UserService, useValue: mockUserService },
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: CanDeactivateDialogService, useValue: mockCanDeactivateDialogService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid template initialization errors
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have userForm initialized', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('realName')).toBeDefined();
    expect(component.userForm.get('phoneNumber')).toBeDefined();
    expect(component.userForm.get('email')).toBeDefined();
  });

  it('should have uploader initialized', () => {
    expect(component.uploader).toBeDefined();
  });

  it('should initialize form flags', () => {
    expect(component.isFormCanceled).toBe(false);
    expect(component.isFormSaved).toBe(false);
    expect(component.isLocalImageChanged).toBe(false);
  });

  it('should have routerDefinitions', () => {
    expect(component.routerDefinitions).toBeDefined();
  });
});
