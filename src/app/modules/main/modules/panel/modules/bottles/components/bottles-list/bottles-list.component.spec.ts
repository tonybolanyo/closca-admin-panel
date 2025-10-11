import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { BottlesListComponent } from './bottles-list.component';
import { BottleService } from 'src/app/shared/custom-gnommo-base/services/bottle.service';

describe('BottlesListComponent', () => {
  let component: BottlesListComponent;
  let fixture: ComponentFixture<BottlesListComponent>;

  beforeEach(waitForAsync(() => {
    const mockBottleService = {
      getAll: jest.fn().mockReturnValue(of({ data: [] })),
      count: jest.fn().mockReturnValue(of({ count: 0 }))
    };

    TestBed.configureTestingModule({
      imports: [ BottlesListComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: BottleService, useValue: mockBottleService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottlesListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
