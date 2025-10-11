import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransformSponsoredFountainToPrivateComponent } from './transform-sponsored-fountain-to-private.component';

describe('TransformSponsoredFountainToPrivateComponent', () => {
  let component: TransformSponsoredFountainToPrivateComponent;
  let mockDialogRef: jest.Mocked<MatDialogRef<TransformSponsoredFountainToPrivateComponent>>;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    } as any;

    mockData = {
      message: 'Transform fountain type?',
      confirmation: 'Please select the new fountain type'
    };

    TestBed.configureTestingModule({
      imports: [TransformSponsoredFountainToPrivateComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    const fixture = TestBed.createComponent(TransformSponsoredFountainToPrivateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form control', () => {
    expect(component.newFountainType).toBeDefined();
    expect(component.newFountainType.value).toBe('');
  });

  it('should have fountain type options', () => {
    expect(component.options).toBeDefined();
    expect(component.options.length).toBe(6);
    expect(component.options[0]).toEqual({ name: 'Restaurante', value: 'RESTAURANT' });
    expect(component.options[1]).toEqual({ name: 'Cafe bar', value: 'CAFE_BAR' });
    expect(component.options[2]).toEqual({ name: 'Hotel / Hostal', value: 'HOTEL_HOSTEL' });
    expect(component.options[3]).toEqual({ name: 'Tienda', value: 'SHOP' });
    expect(component.options[4]).toEqual({ name: 'Banco', value: 'BANK' });
    expect(component.options[5]).toEqual({ name: 'Otro', value: 'OTHERS' });
  });

  it('should require fountain type selection', () => {
    expect(component.newFountainType.valid).toBe(false);
    component.newFountainType.setValue('RESTAURANT');
    expect(component.newFountainType.valid).toBe(true);
  });

  it('should close dialog with selected fountain type on accept', () => {
    component.newFountainType.setValue('RESTAURANT');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('RESTAURANT');
  });

  it('should close dialog with false on reject', () => {
    component.onCloseReject();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should pass data to component', () => {
    expect(component.data).toBe(mockData);
    expect(component.data.message).toBe('Transform fountain type?');
    expect(component.data.confirmation).toBe('Please select the new fountain type');
  });

  it('should handle different fountain type values', () => {
    component.newFountainType.setValue('CAFE_BAR');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('CAFE_BAR');

    mockDialogRef.close.mockClear();

    component.newFountainType.setValue('HOTEL_HOSTEL');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('HOTEL_HOSTEL');
  });

  it('should handle all available fountain types', () => {
    const types = ['RESTAURANT', 'CAFE_BAR', 'HOTEL_HOSTEL', 'SHOP', 'BANK', 'OTHERS'];
    
    types.forEach(type => {
      component.newFountainType.setValue(type);
      expect(component.newFountainType.valid).toBe(true);
      component.onCloseAccept();
      expect(mockDialogRef.close).toHaveBeenCalledWith(type);
      mockDialogRef.close.mockClear();
    });
  });
});
