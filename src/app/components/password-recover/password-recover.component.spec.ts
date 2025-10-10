import { PasswordRecoverComponent } from './password-recover.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';

describe('PasswordRecoverComponent', () => {
  let component: PasswordRecoverComponent;
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
        queryParams: {}
      }
    };
    mockUserService = {
      passwordRecovery: jest.fn()
    };

    component = new PasswordRecoverComponent(
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

  describe('buildPasswordRecoverForm', () => {
    it('should build form with email field', () => {
      expect(component.passwordRecoverForm).toBeDefined();
      expect(component.passwordRecoverForm.get('email')).toBeDefined();
    });

    it('should require email field', () => {
      const emailControl = component.passwordRecoverForm.get('email');
      emailControl.setValue('');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.passwordRecoverForm.get('email');
      emailControl.setValue('invalid-email');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.passwordRecoverForm.get('email');
      emailControl.setValue('test@example.com');
      expect(emailControl.valid).toBe(true);
    });
  });

  describe('sendPasswordRecover', () => {
    it('should call passwordRecovery service on success', () => {
      mockUserService.passwordRecovery.mockReturnValue(of({ success: true }));
      const values = { email: 'test@example.com' };

      component.sendPasswordRecover(values);

      expect(mockUserService.passwordRecovery).toHaveBeenCalledWith('test@example.com');
    });

    it('should show success message and navigate to login on successful recovery', () => {
      mockUserService.passwordRecovery.mockReturnValue(of({ success: true }));
      const values = { email: 'test@example.com' };

      component.sendPasswordRecover(values);

      expect(mockToastr.success).toHaveBeenCalledWith(
        'Se ha enviado un mensaje a su correo electrónico',
        'Listo'
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });

    it('should show error message when email not found (404)', () => {
      mockUserService.passwordRecovery.mockReturnValue(
        throwError({ statusCode: 404 })
      );
      const values = { email: 'notfound@example.com' };

      component.sendPasswordRecover(values);

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Este correo no se ha encontrado',
        'Error'
      );
    });

    it('should show generic error message on other errors', () => {
      mockUserService.passwordRecovery.mockReturnValue(
        throwError({ statusCode: 500 })
      );
      const values = { email: 'test@example.com' };

      component.sendPasswordRecover(values);

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Se ha producido un error al enviar el mensaje a su correo',
        'Error'
      );
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
