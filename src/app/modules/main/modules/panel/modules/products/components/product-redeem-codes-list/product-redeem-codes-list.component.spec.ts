import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { ProductRedeemCodesListComponent } from './product-redeem-codes-list.component';
import { RewardService } from 'src/app/shared/custom-gnommo-base/services';

describe('ProductRedeemCodesListComponent', () => {
  let component: ProductRedeemCodesListComponent;
  let fixture: ComponentFixture<ProductRedeemCodesListComponent>;

  beforeEach(waitForAsync(() => {
    const mockRewardService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0))
    };

    TestBed.configureTestingModule({
      imports: [ ProductRedeemCodesListComponent, ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: RewardService, useValue: mockRewardService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRedeemCodesListComponent);
    component = fixture.componentInstance;
    component.productId = 'test-product-id';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have filterForm initialized', () => {
    expect(component.filterForm).toBeDefined();
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have table config defined', () => {
    expect(component.tableConfig).toBeDefined();
    expect(component.tableConfig.filterColumnEnabled).toBe(true);
    expect(component.tableConfig.paginatorExists).toBe(true);
  });

  it('should initialize codesRedeemed as empty array', () => {
    expect(component.codesRedeemed).toEqual([]);
  });
});
