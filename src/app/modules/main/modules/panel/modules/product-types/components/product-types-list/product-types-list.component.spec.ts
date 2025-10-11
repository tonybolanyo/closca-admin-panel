import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { ProductTypesListComponent } from './product-types-list.component';
import { ProductTypesService } from 'src/app/shared/custom-gnommo-base/services';

describe('ProductTypesListComponent', () => {
  let component: ProductTypesListComponent;
  let fixture: ComponentFixture<ProductTypesListComponent>;

  beforeEach(waitForAsync(() => {
    const mockProductTypesService = {
      getAll: jest.fn().mockReturnValue(of([])),
      delete: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [ ProductTypesListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: ProductTypesService, useValue: mockProductTypesService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have table config defined', () => {
    expect(component.tableConfig).toBeDefined();
    expect(component.tableConfig.filterColumnEnabled).toBe(false);
    expect(component.tableConfig.paginatorExists).toBe(false);
  });

  it('should have routerDefinitions', () => {
    expect(component.routerDefinitions).toBeDefined();
  });
});
