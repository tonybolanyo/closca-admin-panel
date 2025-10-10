import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { BottleTypesListComponent } from './bottle-types-list.component';
import { BottleTypesService } from 'src/app/shared/custom-gnommo-base/services/bottle-types.service';

describe('BottleTypesListComponent', () => {
  let component: BottleTypesListComponent;
  let fixture: ComponentFixture<BottleTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleTypesListComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: BottleTypesService, useValue: { getAll: jest.fn().mockReturnValue(of({})), count: jest.fn().mockReturnValue(of({})) } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleTypesListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
