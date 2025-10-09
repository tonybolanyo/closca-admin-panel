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

  it('should check if user is authenticated', () => {
    mockAuthService.getToken.mockReturnValue({ id: 'valid-token' });
    expect(service.isAuthenticated()).toBe(true);
    mockAuthService.getToken.mockReturnValue({ id: null });
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout user', () => {
    service.logout();
    expect(mockCookieStorage.remove).toHaveBeenCalledWith('user');
    expect(mockAuthService.removeToken).toHaveBeenCalled();
  });
});