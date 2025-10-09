import { CookiesComponent } from './cookies.component';

describe('CookiesComponent', () => {
  let component: CookiesComponent;
  let mockBottomSheetRef: any;

  beforeEach(() => {
    mockBottomSheetRef = {
      dismiss: jest.fn()
    };

    component = new CookiesComponent(mockBottomSheetRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should dismiss bottom sheet when acceptCookies is called', () => {
    // Mock the global event object
    (global as any).event = { preventDefault: jest.fn() };
    
    component.acceptCookies();
    
    expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    
    // Clean up
    delete (global as any).event;
  });
});
