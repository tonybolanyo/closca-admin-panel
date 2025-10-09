import { ResetPasswordComponent } from './reset-password.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let mockFormBuilder: FormBuilder;
  let mockRouter: any;
  let mockToastr: any;
  let mockActivatedRoute: any;
  let mockUserService: any;

  beforeEach(() => {
    mockFormBuilder = new FormBuilder();
    mockRouter = {
      navigate: jest.fn()
    };
    mockToastr = {
      success: jest.fn(),
      error: jest.fn()
    };
    mockActivatedRoute = {
      snapshot: {
        queryParams: { hash: 'test-hash-123' }
      }
    };
    mockUserService = {
      resetPassword: jest.fn()
    };

    component = new ResetPasswordComponent(
      mockFormBuilder,
      mockRouter,
      mockToastr,
      mockActivatedRoute,
      mockUserService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract hash from route query params', () => {
    expect(component.hash).toBe('test-hash-123');
  });

  describe('buildResetPasswordForm', () => {
    it('should build form with password and passwordRepeat fields', () => {
      expect(component.resetPasswordForm).toBeDefined();
      expect(component.resetPasswordForm.get('password')).toBeDefined();
      expect(component.resetPasswordForm.get('passwordRepeat')).toBeDefined();
    });

    it('should require password field', () => {
      const passwordControl = component.resetPasswordForm.get('password');
      passwordControl.setValue('');
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('required')).toBe(true);
    });

    it('should require passwordRepeat field', () => {
      const passwordRepeatControl = component.resetPasswordForm.get('passwordRepeat');
      passwordRepeatControl.setValue('');
      expect(passwordRepeatControl.valid).toBe(false);
      expect(passwordRepeatControl.hasError('required')).toBe(true);
    });

    it('should accept valid passwords', () => {
      const passwordControl = component.resetPasswordForm.get('password');
      const passwordRepeatControl = component.resetPasswordForm.get('passwordRepeat');
      
      passwordControl.setValue('myPassword123');
      passwordRepeatControl.setValue('myPassword123');
      
      expect(passwordControl.valid).toBe(true);
      expect(passwordRepeatControl.valid).toBe(true);
    });
  });

  describe('sendResetPassword', () => {
    it('should call resetPassword service when passwords match', () => {
      mockUserService.resetPassword.mockReturnValue(of({ success: true }));
      const values = { password: 'newPassword123', passwordRepeat: 'newPassword123' };

      component.sendResetPassword(values);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        'newPassword123',
        'test-hash-123'
      );
    });

    it('should decode hash before calling resetPassword', () => {
      mockActivatedRoute.snapshot.queryParams.hash = 'encoded%20hash';
      component = new ResetPasswordComponent(
        mockFormBuilder,
        mockRouter,
        mockToastr,
        mockActivatedRoute,
        mockUserService
      );
      mockUserService.resetPassword.mockReturnValue(of({ success: true }));
      const values = { password: 'newPassword123', passwordRepeat: 'newPassword123' };

      component.sendResetPassword(values);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        'newPassword123',
        'encoded hash'
      );
    });

    it('should show success message and navigate to login on successful reset', () => {
      mockUserService.resetPassword.mockReturnValue(of({ success: true }));
      const values = { password: 'newPassword123', passwordRepeat: 'newPassword123' };

      component.sendResetPassword(values);

      expect(mockToastr.success).toHaveBeenCalledWith(
        'Contraseña cambiada con exito',
        'Listo'
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });

    it('should show error message when passwords do not match', () => {
      const values = { password: 'password1', passwordRepeat: 'password2' };

      component.sendResetPassword(values);

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Las contraseñas no coinciden',
        'Error'
      );
      expect(mockUserService.resetPassword).not.toHaveBeenCalled();
    });

    it('should not navigate when passwords do not match', () => {
      const values = { password: 'password1', passwordRepeat: 'password2' };

      component.sendResetPassword(values);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateToLogin', () => {
    it('should navigate to login page', () => {
      component.navigateToLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });
  });

  it('should have routerDefinitions set', () => {
    expect(component.routerDefinitions).toBe(ROUTER_DEFINITIONS);
  });
});
