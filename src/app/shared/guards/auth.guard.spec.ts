import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';
import { ROUTER_DEFINITIONS } from '../constants/router-definitions';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: any;
  let mockLoggedUserService: any;
  let mockCookieStorage: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };

    mockLoggedUserService = {
      isAuthenticated: jest.fn(),
      getRole: jest.fn()
    };

    mockCookieStorage = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn()
    };

    guard = new AuthGuard(mockRouter, mockLoggedUserService, mockCookieStorage);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should redirect to login when user is not authenticated', () => {
      mockLoggedUserService.isAuthenticated.mockReturnValue(false);
      const mockRoute: any = {};
      const mockState: any = { url: '/admin/panel/home' };

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });

    it('should redirect to login when route is not authorized for role', () => {
      mockLoggedUserService.isAuthenticated.mockReturnValue(true);
      mockLoggedUserService.getRole.mockReturnValue('USER');
      const mockRoute: any = {};
      const mockState: any = { url: '/admin/panel/home' };

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
    });

    it('should allow access when user is authenticated and authorized for ADMIN role', () => {
      mockLoggedUserService.isAuthenticated.mockReturnValue(true);
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      const mockRoute: any = {};
      const mockState: any = { url: '/admin/panel/home' };

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when user is authenticated and authorized for MANAGER role', () => {
      mockLoggedUserService.isAuthenticated.mockReturnValue(true);
      mockLoggedUserService.getRole.mockReturnValue('MANAGER');
      const mockRoute: any = {};
      const mockState: any = { url: '/admin/panel/home' };

      const result = guard.canActivate(mockRoute, mockState);

      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('canActivateChild', () => {
    it('should use the same authorization logic as canActivate', () => {
      mockLoggedUserService.isAuthenticated.mockReturnValue(true);
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      const mockRoute: any = {};
      const mockState: any = { url: '/admin/panel/users' };

      const result = guard.canActivateChild(mockRoute, mockState);

      expect(result).toBe(true);
    });
  });

  describe('prepareRoute', () => {
    it('should extract panel route correctly', () => {
      const routeUrl = '/admin/panel/home';
      const result = guard.prepareRoute(routeUrl);
      expect(result).toBe('./admin/panel/home');
    });

    it('should extract non-panel route correctly', () => {
      const routeUrl = '/admin/user-profile';
      const result = guard.prepareRoute(routeUrl);
      expect(result).toBe('./admin/user-profile');
    });
  });

  describe('routeAndRoleBroker', () => {
    it('should return true for ADMIN accessing home', () => {
      const mockState: any = { url: '/admin/panel/home' };
      const result = guard.routeAndRoleBroker('ADMIN', mockState);
      expect(result).toBe(true);
    });

    it('should return undefined for unauthorized role/route combination', () => {
      const mockState: any = { url: '/admin/panel/levels' };
      const result = guard.routeAndRoleBroker('MANAGER', mockState);
      expect(result).toBeUndefined();
    });

    it('should return true for MANAGER accessing reports', () => {
      const mockState: any = { url: '/admin/panel/reports' };
      const result = guard.routeAndRoleBroker('MANAGER', mockState);
      expect(result).toBe(true);
    });
  });
});
