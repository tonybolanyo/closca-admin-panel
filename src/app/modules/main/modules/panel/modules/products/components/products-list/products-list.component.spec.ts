import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ProductsListComponent } from './products-list.component';
import { ProductService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(waitForAsync(() => {
    const mockProductService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0)),
      delete: jest.fn().mockReturnValue(of({}))
    };

    const mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of([]))
    };

    const mockLoggedUserService = {
      getRole: jest.fn().mockReturnValue('ADMIN'),
      getCorporateId: jest.fn().mockReturnValue('123')
    };

    const mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({}))
      })
    };

    TestBed.configureTestingModule({
      imports: [ ProductsListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ProductService, useValue: mockProductService },
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LoggedUserService, useValue: mockLoggedUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct filter for ADMIN role', () => {
    expect(component.filter).toContain('"instance.status":"ACTIVE"');
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have product statuses initialized', () => {
    expect(component.productStatus).toBeDefined();
    expect(component.productStatus.length).toBeGreaterThan(0);
  });

  it('should initialize itemsSelected as empty array', () => {
    expect(component.itemsSelected).toEqual([]);
  });
});
