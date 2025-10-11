import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let mockLoggedUserService: jest.Mocked<Partial<LoggedUserService>>;

  beforeEach(() => {
    mockLoggedUserService = {
      getRole: jest.fn().mockReturnValue('ADMIN'),
      getLoggedUserValue: jest.fn().mockReturnValue({
        _id: 'user-123',
        userName: 'testuser',
        email: 'test@example.com',
        role: 'ADMIN'
      })
    };

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    });

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user and role on ngOnInit', () => {
    component.ngOnInit();

    expect(mockLoggedUserService.getRole).toHaveBeenCalled();
    expect(mockLoggedUserService.getLoggedUserValue).toHaveBeenCalled();
    expect(component.role).toBe('ADMIN');
    expect(component.user).toBeDefined();
    expect(component.user._id).toBe('user-123');
  });

  it('should set role from logged user service', () => {
    component.ngOnInit();
    expect(component.role).toBe('ADMIN');
  });

  it('should set user from logged user service', () => {
    component.ngOnInit();
    expect(component.user).toEqual({
      _id: 'user-123',
      userName: 'testuser',
      email: 'test@example.com',
      role: 'ADMIN'
    });
  });

  it('should handle different user roles', () => {
    mockLoggedUserService.getRole = jest.fn().mockReturnValue('MANAGER');
    component.ngOnInit();
    expect(component.role).toBe('MANAGER');
  });
});
