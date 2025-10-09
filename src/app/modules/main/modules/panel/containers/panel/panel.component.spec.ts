import { PanelComponent } from './panel.component';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { ADMIN_MENU_ITEMS, MANAGER_MENU_ITEMS, PROVIDER_MENU_ITEMS, USER_MENU_ITEMS, MENU_ITEMS } from '../../../../../../shared/constants/menu-items';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let mockLoggedUserService: any;

  beforeEach(() => {
    mockLoggedUserService = {
      getRole: jest.fn()
    };
  });

  it('should create', () => {
    mockLoggedUserService.getRole.mockReturnValue('ADMIN');
    component = new PanelComponent(mockLoggedUserService);
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set ADMIN sidebar items for ADMIN role', () => {
      mockLoggedUserService.getRole.mockReturnValue('ADMIN');
      component = new PanelComponent(mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.sidebarItems).toEqual(ADMIN_MENU_ITEMS);
    });

    it('should set MANAGER sidebar items for MANAGER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('MANAGER');
      component = new PanelComponent(mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.sidebarItems).toEqual(MANAGER_MENU_ITEMS);
    });

    it('should set PROVIDER sidebar items for PROVIDER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('PROVIDER');
      component = new PanelComponent(mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.sidebarItems).toEqual(PROVIDER_MENU_ITEMS);
    });

    it('should set USER sidebar items for USER role', () => {
      mockLoggedUserService.getRole.mockReturnValue('USER');
      component = new PanelComponent(mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.sidebarItems).toEqual(USER_MENU_ITEMS);
    });

    it('should set default sidebar items for unknown role', () => {
      mockLoggedUserService.getRole.mockReturnValue('UNKNOWN');
      component = new PanelComponent(mockLoggedUserService);
      
      component.ngOnInit();
      
      expect(component.sidebarItems).toEqual(MENU_ITEMS);
    });
  });

  it('should store role from logged user service', () => {
    mockLoggedUserService.getRole.mockReturnValue('ADMIN');
    component = new PanelComponent(mockLoggedUserService);
    
    expect(component.role).toBe('ADMIN');
  });
});
