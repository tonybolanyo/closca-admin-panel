import { DialogConfirmationComponent } from './dialog-confirmation.component';

describe('DialogConfirmationComponent (Unit Tests)', () => {
  let component: DialogConfirmationComponent;
  let mockDialogRef: any;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    };

    mockData = {
      message: 'Are you sure you want to continue?'
    };

    // Create component instance directly for unit testing
    component = new DialogConfirmationComponent(mockDialogRef, mockData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.data).toBe(mockData);
    expect(component.data.message).toBe('Are you sure you want to continue?');
  });

  it('should have dialogRef available', () => {
    expect(component.dialogRef).toBe(mockDialogRef);
  });

  it('should close dialog with true when onCloseAccept is called', () => {
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when onCloseReject is called', () => {
    component.onCloseReject();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});