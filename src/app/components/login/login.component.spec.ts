import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { AuthService, CookieStorage } from '@tyris/angular-foundation';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    const mockUserService = {
      login: jest.fn().mockReturnValue(of({ token: 'test-token' })),
      getCurrentUser: jest.fn().mockReturnValue(of({ role: 'ADMIN', _id: '123' }))
    };

    const mockLoggedUserService = {
      setLoggedUser: jest.fn(),
      logout: jest.fn()
    };

    const mockAuthService = {
      setToken: jest.fn()
    };

    const mockActivatedRoute = {
      snapshot: {
        params: {}
      }
    };

    TestBed.configureTestingModule({
      imports: [ LoginComponent, ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: UserService, useValue: mockUserService },
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieStorage, useValue: {} },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loginForm initialized', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should require email field', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl.hasError('required')).toBe(true);
  });

  it('should require password field', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('email')).toBe(true);
    
    emailControl.setValue('valid@email.com');
    expect(emailControl.hasError('email')).toBe(false);
  });

  it('should have routerDefinitions', () => {
    expect(component.routerDefinitions).toBeDefined();
  });

  it('should call buildLoginForm on init', () => {
    const spy = jest.spyOn(component, 'buildLoginForm');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
