import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let mockRouter: any;
  let mockFormBuilder: FormBuilder;
  let mockUserService: any;
  let mockToastr: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockFormBuilder = new FormBuilder();
    mockUserService = {
      register: jest.fn()
    };
    mockToastr = {
      success: jest.fn(),
      error: jest.fn()
    };

    component = new RegisterComponent(
      mockRouter,
      mockFormBuilder,
      mockUserService,
      mockToastr
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildForm', () => {
    it('should build form with required fields', () => {
      expect(component.userDataForm).toBeDefined();
      expect(component.userDataForm.get('realName')).toBeDefined();
      expect(component.userDataForm.get('email')).toBeDefined();
      expect(component.userDataForm.get('phoneNumber')).toBeDefined();
      expect(component.userDataForm.get('password')).toBeDefined();
    });

    it('should require realName field', () => {
      const realNameControl = component.userDataForm.get('realName');
      realNameControl.setValue('');
      expect(realNameControl.valid).toBe(false);
      expect(realNameControl.hasError('required')).toBe(true);
    });

    it('should require email field', () => {
      const emailControl = component.userDataForm.get('email');
      emailControl.setValue('');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.userDataForm.get('email');
      emailControl.setValue('invalid-email');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.userDataForm.get('email');
      emailControl.setValue('test@example.com');
      expect(emailControl.valid).toBe(true);
    });

    it('should require phoneNumber field', () => {
      const phoneNumberControl = component.userDataForm.get('phoneNumber');
      phoneNumberControl.setValue('');
      expect(phoneNumberControl.valid).toBe(false);
      expect(phoneNumberControl.hasError('required')).toBe(true);
    });

    it('should require password field', () => {
      const passwordControl = component.userDataForm.get('password');
      passwordControl.setValue('');
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('required')).toBe(true);
    });
  });

  describe('register', () => {
    it('should add USER role to form values', () => {
      mockUserService.register.mockReturnValue(of({ id: '123' }));
      const formValues = {
        realName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123456789',
        password: 'password123'
      };

      component.register(formValues);

      expect(mockUserService.register).toHaveBeenCalledWith({
        ...formValues,
        role: 'USER'
      });
    });

    it('should show success message on successful registration', () => {
      mockUserService.register.mockReturnValue(of({ id: '123' }));
      const formValues = {
        realName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123456789',
        password: 'password123'
      };

      component.register(formValues);

      expect(mockToastr.success).toHaveBeenCalledWith(
        'Registro realizado correctamente',
        'Listo'
      );
    });

    it('should navigate to login page on successful registration', () => {
      mockUserService.register.mockReturnValue(of({ id: '123' }));
      const formValues = {
        realName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123456789',
        password: 'password123'
      };

      component.register(formValues);

      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });

    it('should show error message on registration failure', () => {
      mockUserService.register.mockReturnValue(
        throwError({ error: 'Registration failed' })
      );
      const formValues = {
        realName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123456789',
        password: 'password123'
      };

      component.register(formValues);

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Ha ocurrido un error en el registro, intentelo de nuevo',
        'Error'
      );
    });

    it('should not navigate on registration failure', () => {
      mockUserService.register.mockReturnValue(
        throwError({ error: 'Registration failed' })
      );
      const formValues = {
        realName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123456789',
        password: 'password123'
      };

      component.register(formValues);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should have routerDefinitions set', () => {
    expect(component.routerDefinitions).toBe(ROUTER_DEFINITIONS);
  });
});
