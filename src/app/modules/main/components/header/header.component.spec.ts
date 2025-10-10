import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { LoggedUserService } from '../../../../shared/services/logged-user.service';
import { ADMIN_MENU_ITEMS, MANAGER_MENU_ITEMS, PROVIDER_MENU_ITEMS, USER_MENU_ITEMS, MENU_ITEMS } from '../../../../shared/constants/menu-items';
import { ROUTER_DEFINITIONS } from '../../../../shared/constants/router-definitions';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let mockRenderer2: any;
  let mockRouter: any;
  let mockCorporateService: any;
  let mockLoggedUserService: any;

  beforeEach(() => {
    mockRenderer2 = {
      setStyle: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn(),
      events: of({})
    };

    mockCorporateService = {
      getById: jest.fn().mockReturnValue(of({ color: '#FF0000' }))
    };

    mockLoggedUserService = {
      getRole: jest.fn(),
      getCorporateId: jest.fn(),
      logout: jest.fn()
    };
  });

  it('should create', () => {
    mockLoggedUserService.getRole.mockReturnValue('ADMIN');
    component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set ADMIN menu items for ADMIN role', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.menuItems).toEqual(ADMIN_MENU_ITEMS);
    });

    it('should set MANAGER menu items and load corporate for MANAGER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('MANAGER');
      mockLoggedUserService.getCorporateId.mockReturnValue('123');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.menuItems).toEqual(MANAGER_MENU_ITEMS);
      expect(mockCorporateService.getById).toHaveBeenCalledWith('123');
    });

    it('should set PROVIDER menu items for PROVIDER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('PROVIDER');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.menuItems).toEqual(PROVIDER_MENU_ITEMS);
    });

    it('should set USER menu items for USER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('USER');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.menuItems).toEqual(USER_MENU_ITEMS);
    });

    it('should set default menu items for unknown role', () => {
      mockLoggedUserService.getRole.mockReturnValue('UNKNOWN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.menuItems).toEqual(MENU_ITEMS);
    });
  });

  describe('menuItemChangeCollapseState', () => {
    it('should set isNavbarCollapsed to true', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      component.isNavbarCollapsed = false;
      
      // Mock the overlay ViewChild
      component.overlay = {
        nativeElement: document.createElement('div')
      } as any;
      
      component.menuItemChangeCollapseState('/some-route');
      
      expect(component.isNavbarCollapsed).toBe(true);
    });
  });

  describe('changeCollapseState', () => {
    it('should toggle isNavbarCollapsed state', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      // Mock the overlay ViewChild
      component.overlay = {
        nativeElement: document.createElement('div')
      } as any;
      
      const initialState = component.isNavbarCollapsed;
      
      component.changeCollapseState();
      
      expect(component.isNavbarCollapsed).toBe(!initialState);
    });
  });

  describe('onLogout', () => {
    it('should navigate to login and call logout service', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      component.onLogout();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
      expect(mockLoggedUserService.logout).toHaveBeenCalled();
    });
  });

  describe('onResize', () => {
    it('should update innerWidth on window resize', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      });
      
      component.onResize({});
      
      expect(component.innerWidth).toBe(1200);
    });
  });

  describe('getImage', () => {
    it('should return S3 URL with file key', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new HeaderComponent(mockRenderer2, mockRouter, mockCorporateService, mockLoggedUserService);
      const fileKey = 'test-image.jpg';
      
      const result = component.getImage(fileKey);
      
      expect(result).toContain(fileKey);
    });
  });
});
