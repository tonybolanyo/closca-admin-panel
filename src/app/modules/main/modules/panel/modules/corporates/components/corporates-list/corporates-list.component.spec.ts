import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { CorporatesListComponent } from './corporates-list.component';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';

describe('CorporatesListComponent', () => {
  let component: CorporatesListComponent;
  let fixture: ComponentFixture<CorporatesListComponent>;

  beforeEach(waitForAsync(() => {
    const mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of([])),
      count: jest.fn().mockReturnValue(of(0)),
      delete: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [ CorporatesListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: CorporateService, useValue: mockCorporateService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporatesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct filter', () => {
    expect(component.filter).toContain('"instance.status": {$ne: "INACTIVE"}');
    expect(component.filter).toContain('"instance.status": {$ne: "DELETED"}');
  });

  it('should have table config defined', () => {
    expect(component.tableConfig).toBeDefined();
    expect(component.tableConfig.filterColumnEnabled).toBe(true);
    expect(component.tableConfig.paginatorExists).toBe(true);
  });

  it('should have paginator configured', () => {
    expect(component.paginator).toBeDefined();
    expect(component.paginator.limit).toBe(10);
    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should have sort configured', () => {
    expect(component.sort).toBe('instance.createdAt');
  });
});
