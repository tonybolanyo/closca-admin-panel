import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogRewardCodesComponent } from './dialog-reward-codes.component';
import { ProductService } from '../../custom-gnommo-base/services';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

describe('DialogRewardCodesComponent', () => {
  let component: DialogRewardCodesComponent;
  let mockDialogRef: jest.Mocked<MatDialogRef<DialogRewardCodesComponent>>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockProductService: jest.Mocked<Partial<ProductService>>;
  let mockToastr: jest.Mocked<Partial<ToastrService>>;
  let mockData: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    } as any;

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    } as any;

    mockProductService = {
      deleteRewardCodes: jest.fn().mockReturnValue(of({}))
    };

    mockToastr = {
      success: jest.fn()
    };

    mockData = {
      product: {
        _id: 'product-123',
        rewards: [
          { rewardCode: 'CODE-001' },
          { rewardCode: 'CODE-002' }
        ]
      }
    };

    TestBed.configureTestingModule({
      imports: [DialogRewardCodesComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    const fixture = TestBed.createComponent(DialogRewardCodesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have code changes event emitter', () => {
    expect(component.codeChanges).toBeDefined();
  });

  it('should close dialog with false on reject', () => {
    component.onCloseReject();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should have data passed to component', () => {
    expect(component.data).toBe(mockData);
    expect(component.data.product._id).toBe('product-123');
  });

  it('should check if code is redeemed', () => {
    const result1 = component.checkCodeIsRedeemed('CODE-001');
    expect(result1).toBe(true);

    const result2 = component.checkCodeIsRedeemed('CODE-999');
    expect(result2).toBe(false);
  });

  it('should return false if product has no rewards', () => {
    component.data.product.rewards = null;
    const result = component.checkCodeIsRedeemed('CODE-001');
    expect(result).toBe(false);
  });

  it('should have deleteCode method defined', () => {
    expect(typeof component.deleteCode).toBe('function');
  });

  it('should have deleteAll method defined', () => {
    expect(typeof component.deleteAll).toBe('function');
  });

  it('should have onCloseAccept method defined', () => {
    expect(typeof component.onCloseAccept).toBe('function');
  });
});
