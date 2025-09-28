import { AppComponent } from './app.component';
import { of } from 'rxjs';

describe('AppComponent (Unit Tests)', () => {
  let component: AppComponent;
  let mockLoggedUserService: any;
  let mockBottomSheet: any;

  beforeEach(() => {
    mockLoggedUserService = {
      checkLoggedUser: jest.fn()
    };

    mockBottomSheet = {
      open: jest.fn()
    };

    component = new AppComponent(mockLoggedUserService, mockBottomSheet);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkLoggedUser on construction', () => {
    expect(mockLoggedUserService.checkLoggedUser).toHaveBeenCalled();
  });

  it('should open cookies bottom sheet with correct configuration', () => {
    const mockBottomSheetRef = {
      afterDismissed: jest.fn().mockReturnValue(of(null))
    };
    
    mockBottomSheet.open.mockReturnValue(mockBottomSheetRef);

    component.checkAllowCookies();

    expect(mockBottomSheet.open).toHaveBeenCalledWith(
      expect.any(Function), // CookiesComponent
      { disableClose: true }
    );
  });

  it('should subscribe to afterDismissed when checkAllowCookies is called', () => {
    const mockBottomSheetRef = {
      afterDismissed: jest.fn().mockReturnValue(of('test-response'))
    };
    
    mockBottomSheet.open.mockReturnValue(mockBottomSheetRef);

    component.checkAllowCookies();

    expect(mockBottomSheetRef.afterDismissed).toHaveBeenCalled();
  });

  it('should handle bottom sheet dismissal response', () => {
    const mockBottomSheetRef = {
      afterDismissed: jest.fn().mockReturnValue(of('test-response'))
    };
    
    mockBottomSheet.open.mockReturnValue(mockBottomSheetRef);

    // Should not throw an error when calling checkAllowCookies
    expect(() => component.checkAllowCookies()).not.toThrow();
  });
});