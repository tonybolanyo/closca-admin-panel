import { DialogInfoComponent } from './dialog-info.component';

describe('DialogInfoComponent (Unit Tests)', () => {
  let component: DialogInfoComponent;
  let mockDialogRef: any;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    };

    mockData = {
      address: 'Test Street 123',
      lat: 40.7128,
      lng: -74.0060
    };

    // Create component instance directly for unit testing
    component = new DialogInfoComponent(mockDialogRef, mockData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.data).toBe(mockData);
    expect(component.data.address).toBe('Test Street 123');
    expect(component.data.lat).toBe(40.7128);
    expect(component.data.lng).toBe(-74.0060);
  });

  it('should have dialogRef available', () => {
    expect(component.dialogRef).toBe(mockDialogRef);
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});