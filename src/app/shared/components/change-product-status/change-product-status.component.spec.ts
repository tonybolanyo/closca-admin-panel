import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeProductStatusComponent } from './change-product-status.component';

describe('ChangeProductStatusComponent', () => {
  let component: ChangeProductStatusComponent;
  let mockDialogRef: jest.Mocked<MatDialogRef<ChangeProductStatusComponent>>;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    } as any;

    mockData = {
      message: 'Change product status?'
    };

    TestBed.configureTestingModule({
      imports: [ChangeProductStatusComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    const fixture = TestBed.createComponent(ChangeProductStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form control', () => {
    expect(component.newProductStatus).toBeDefined();
    expect(component.newProductStatus.value).toBe('');
  });

  it('should have status options', () => {
    expect(component.options).toBeDefined();
    expect(component.options.length).toBe(3);
    expect(component.options[0]).toEqual({ name: 'Visible', value: 'VISIBLE' });
    expect(component.options[1]).toEqual({ name: 'Invisible', value: 'INVISIBLE' });
    expect(component.options[2]).toEqual({ name: 'Sin stock', value: 'OUT_OF_STOCK' });
  });

  it('should require product status selection', () => {
    expect(component.newProductStatus.valid).toBe(false);
    component.newProductStatus.setValue('VISIBLE');
    expect(component.newProductStatus.valid).toBe(true);
  });

  it('should close dialog with selected status on accept', () => {
    component.newProductStatus.setValue('INVISIBLE');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('INVISIBLE');
  });

  it('should close dialog with false on reject', () => {
    component.onCloseReject();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should pass data to component', () => {
    expect(component.data).toBe(mockData);
    expect(component.data.message).toBe('Change product status?');
  });

  it('should handle different status values', () => {
    component.newProductStatus.setValue('VISIBLE');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('VISIBLE');

    mockDialogRef.close.mockClear();

    component.newProductStatus.setValue('OUT_OF_STOCK');
    component.onCloseAccept();
    expect(mockDialogRef.close).toHaveBeenCalledWith('OUT_OF_STOCK');
  });
});
