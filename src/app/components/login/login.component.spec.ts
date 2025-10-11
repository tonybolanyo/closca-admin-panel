import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { AuthService, CookieStorage } from '@tyris/angular-foundation';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: any;
  let mockLoggedUserService: any;
  let mockAuthService: any;
  let mockToastrService: any;
  let mockRouter: any;

  beforeEach(waitForAsync(() => {
    mockUserService = {
      login: jest.fn().mockReturnValue(of({ token: 'test-token' })),
      getCurrentUser: jest.fn().mockReturnValue(of({ role: 'ADMIN', _id: '123' }))
    };

    mockLoggedUserService = {
      setLoggedUser: jest.fn(),
      logout: jest.fn()
    };

    mockAuthService = {
      setToken: jest.fn()
    };

    mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
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
        { provide: ToastrService, useValue: mockToastrService },
        { provide: UserService, useValue: mockUserService },
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieStorage, useValue: {} },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
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

  it('should call sendLoginUser on sendLogin', () => {
    const spy = jest.spyOn(component, 'sendLoginUser');
    const values = { email: 'test@test.com', password: 'password123' };
    component.sendLogin(values);
    expect(spy).toHaveBeenCalledWith(values);
  });

  it('should successfully login an admin user', () => {
    const values = { email: 'admin@test.com', password: 'password123' };
    const mockToken = { token: 'test-token' };
    const mockUser = { role: 'ADMIN', _id: '123', isAdmin: true };

    mockUserService.login.mockReturnValue(of(mockToken));
    mockUserService.getCurrentUser.mockReturnValue(of({ role: 'ADMIN', _id: '123' }));

    component.sendLoginUser(values);

    expect(mockUserService.login).toHaveBeenCalledWith(values, { 'Accept-language': 'es' });
    expect(mockAuthService.setToken).toHaveBeenCalledWith(mockToken.token);
    expect(mockUserService.getCurrentUser).toHaveBeenCalledWith(mockToken.token);
  });

  it('should successfully login a manager user', () => {
    const values = { email: 'manager@test.com', password: 'password123' };
    const mockToken = { token: 'test-token' };
    const mockUser = { role: 'MANAGER', _id: '456' };

    mockUserService.login.mockReturnValue(of(mockToken));
    mockUserService.getCurrentUser.mockReturnValue(of(mockUser));

    component.sendLoginUser(values);

    expect(mockUserService.login).toHaveBeenCalledWith(values, { 'Accept-language': 'es' });
    expect(mockAuthService.setToken).toHaveBeenCalledWith(mockToken.token);
  });

  it('should reject login for non-admin users', () => {
    const values = { email: 'user@test.com', password: 'password123' };
    const mockToken = { token: 'test-token' };
    const mockUser = { role: 'USER', _id: '789' };

    mockUserService.login.mockReturnValue(of(mockToken));
    mockUserService.getCurrentUser.mockReturnValue(of(mockUser));

    component.sendLoginUser(values);

    expect(mockLoggedUserService.logout).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Solo pueden iniciar sesión los administradores',
      'Fallo inicio de sesión'
    );
  });

  it('should handle login error', () => {
    const values = { email: 'wrong@test.com', password: 'wrongpassword' };
    const error = { error: { error: 'Invalid credentials' } };

    mockUserService.login.mockReturnValue(throwError(error));

    component.sendLoginUser(values);

    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Invalid credentials',
      'Fallo inicio de sesión'
    );
  });

  it('should navigate to password recover page', () => {
    component.passwordRecover();
    expect(mockRouter.navigate).toHaveBeenCalledWith([component.routerDefinitions.passwordRecover]);
  });

  it('should remove corporate primary CSS variable on init', () => {
    const removeSpy = jest.spyOn(document.documentElement.style, 'removeProperty');
    component.ngOnInit();
    expect(removeSpy).toHaveBeenCalledWith('--corporate-primary');
  });
});
