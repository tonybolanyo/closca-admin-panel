import { LoggedUserGuard } from './logged-user.guard';
import { Router } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';
import { ROUTER_DEFINITIONS } from '../constants/router-definitions';

describe('LoggedUserGuard', () => {
  let guard: LoggedUserGuard;
  let mockRouter: any;
  let mockLoggedUserService: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };

    mockLoggedUserService = {
      isAuthenticated: jest.fn(),
      getRole: jest.fn()
    };

    guard = new LoggedUserGuard(mockRouter, mockLoggedUserService);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is not authenticated', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(false);
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to home and return false when user is ADMIN', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(true);
    mockLoggedUserService.getRole.mockReturnValue('ADMIN');
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.home]);
  });

  it('should navigate to home and return false when user is USER', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(true);
    mockLoggedUserService.getRole.mockReturnValue('USER');
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.home]);
  });

  it('should navigate to home and return false when user is PROVIDER', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(true);
    mockLoggedUserService.getRole.mockReturnValue('PROVIDER');
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.home]);
  });

  it('should navigate to login and return false when user has unknown role', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(true);
    mockLoggedUserService.getRole.mockReturnValue('UNKNOWN');
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
  });

  it('should navigate to login and return false when user has null role', () => {
    mockLoggedUserService.isAuthenticated.mockReturnValue(true);
    mockLoggedUserService.getRole.mockReturnValue(null);
    
    const result = guard.canActivate(null, null);
    
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
  });
});