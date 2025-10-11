import { TestBed } from '@angular/core/testing';
import { LoggedUserService } from './logged-user.service';

// Mock the dependencies to avoid external library issues
jest.mock('../custom-gnommo-base/services', () => ({
  UserService: class MockUserService {
    getCurrentUser = jest.fn().mockReturnValue({
      subscribe: jest.fn()
    });
  }
}));

jest.mock('@tyris/angular-foundation', () => ({
  AuthService: class MockAuthService {
    getToken = jest.fn().mockReturnValue({ id: 'mock-token' });
    removeToken = jest.fn();
    expiresTime = jest.fn().mockReturnValue(new Date());
  },
  CookieStorage: class MockCookieStorage {
    get = jest.fn();
    set = jest.fn();
    remove = jest.fn();
  }
}));

describe('LoggedUserService', () => {
  let service: LoggedUserService;
  let mockAuthService: any;
  let mockUserService: any;
  let mockCookieStorage: any;

  beforeEach(() => {
    // Import mocked classes here after they've been mocked
    const { AuthService, CookieStorage } = require('@tyris/angular-foundation');
    const { UserService } = require('../custom-gnommo-base/services');

    mockAuthService = new AuthService();
    mockUserService = new UserService();
    mockCookieStorage = new CookieStorage();

    TestBed.configureTestingModule({
      providers: [
        LoggedUserService,
        { provide: 'AuthService', useValue: mockAuthService },
        { provide: 'UserService', useValue: mockUserService },
        { provide: 'CookieStorage', useValue: mockCookieStorage }
      ]
    });

    // Manual instantiation since DI might not work with mocks
    service = new LoggedUserService(mockAuthService, mockUserService, mockCookieStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRole', () => {
    it('should return null role when no user is logged', () => {
      mockCookieStorage.get.mockReturnValue(null);
      const role = service.getRole();
      expect(role).toBeNull();
    });

    it('should return role from logged user', () => {
      const mockUser = { role: 'ADMIN' };
      service.setLoggedUser(mockUser);
      const role = service.getRole();
      expect(role).toBe('ADMIN');
    });

    it('should return role from cookie (string)', () => {
      mockCookieStorage.get.mockReturnValue('{"role":"MANAGER"}');
      const role = service.getRole();
      expect(role).toBe('MANAGER');
    });

    it('should return role from cookie (object)', () => {
      mockCookieStorage.get.mockReturnValue({ role: 'USER' });
      const role = service.getRole();
      expect(role).toBe('USER');
    });

    it('should return null when cookie has no role', () => {
      mockCookieStorage.get.mockReturnValue('{"name":"Test"}');
      const role = service.getRole();
      expect(role).toBeNull();
    });
  });

  describe('getCorporateId', () => {
    it('should return corporateId from logged user', () => {
      const mockUser = { corporateId: 'corp-123' };
      service.setLoggedUser(mockUser);
      const id = service.getCorporateId();
      expect(id).toBe('corp-123');
    });

    it('should return corporateId from cookie (string)', () => {
      mockCookieStorage.get.mockReturnValue('{"corporateId":"corp-456"}');
      const id = service.getCorporateId();
      expect(id).toBe('corp-456');
    });

    it('should return corporateId from cookie (object)', () => {
      mockCookieStorage.get.mockReturnValue({ corporateId: 'corp-789' });
      const id = service.getCorporateId();
      expect(id).toBe('corp-789');
    });

    it('should return null when no corporateId', () => {
      mockCookieStorage.get.mockReturnValue(null);
      const id = service.getCorporateId();
      expect(id).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should check if user is authenticated', () => {
      mockAuthService.getToken.mockReturnValue({ id: 'valid-token' });
      expect(service.isAuthenticated()).toBe(true);
      mockAuthService.getToken.mockReturnValue({ id: null });
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout user', () => {
      service.logout();
      expect(mockCookieStorage.remove).toHaveBeenCalledWith('user');
      expect(mockAuthService.removeToken).toHaveBeenCalled();
    });
  });

  describe('getLoggedUserValue', () => {
    it('should return current logged user value', () => {
      const mockUser = { id: '1', name: 'Test' };
      service.setLoggedUser(mockUser);
      expect(service.getLoggedUserValue()).toEqual(mockUser);
    });
  });

  describe('getLoggedUser', () => {
    it('should return observable of logged user', (done) => {
      const mockUser = { id: '1', name: 'Test' };
      service.setLoggedUser(mockUser);
      service.getLoggedUser().subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  describe('checkLoggedUser', () => {
    it('should fetch user when token exists', () => {
      const mockResponse = { id: '1', name: 'Test' };
      mockUserService.getCurrentUser.mockReturnValue({
        subscribe: jest.fn((successFn) => {
          successFn(mockResponse);
        })
      });
      mockCookieStorage.get.mockReturnValue({ role: 'USER' });
      
      service.checkLoggedUser();
      
      expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    });

    it('should handle ADMIN role', () => {
      const mockResponse = { id: '1', name: 'Test' };
      mockUserService.getCurrentUser.mockReturnValue({
        subscribe: jest.fn((successFn) => {
          successFn(mockResponse);
        })
      });
      mockCookieStorage.get.mockReturnValue({ role: 'ADMIN' });
      
      service.checkLoggedUser();
      
      const user = service.getLoggedUserValue();
      expect(user.isAdmin).toBe(true);
    });

    it('should handle MANAGER role with isAdmin', () => {
      const mockCookie = { role: 'MANAGER', isAdmin: true };
      mockUserService.getCurrentUser.mockReturnValue({
        subscribe: jest.fn((successFn) => {
          successFn({ id: '1', name: 'Test' });
        })
      });
      mockCookieStorage.get.mockReturnValue(mockCookie);
      
      service.checkLoggedUser();
      
      const user = service.getLoggedUserValue();
      expect(user).toEqual(mockCookie);
    });

    it('should logout on error', () => {
      mockUserService.getCurrentUser.mockReturnValue({
        subscribe: jest.fn((successFn, errorFn) => {
          errorFn('error');
        })
      });
      const logoutSpy = jest.spyOn(service, 'logout');
      
      service.checkLoggedUser();
      
      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should logout when no token', () => {
      mockAuthService.getToken.mockReturnValue({ id: null });
      const logoutSpy = jest.spyOn(service, 'logout');
      
      service.checkLoggedUser();
      
      expect(logoutSpy).toHaveBeenCalled();
    });
  });
});