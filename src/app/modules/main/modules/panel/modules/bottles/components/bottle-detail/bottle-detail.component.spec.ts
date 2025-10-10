import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { BottleDetailComponent } from './bottle-detail.component';
import { BottleService } from 'src/app/shared/custom-gnommo-base/services/bottle.service';
import { BottleTypesService } from 'src/app/shared/custom-gnommo-base/services/bottle-types.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { AuthService } from '@tyris/angular-foundation';

describe('BottleDetailComponent', () => {
  let component: BottleDetailComponent;
  let fixture: ComponentFixture<BottleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleDetailComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {}, url: [{ path: 'create' }] }
          } 
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: DateAdapter, useValue: { setLocale: jest.fn() } },
        { provide: Location, useValue: { back: jest.fn() } },
        { provide: BottleService, useValue: { getById: jest.fn().mockReturnValue(of({})), create: jest.fn(), update: jest.fn() } },
        { provide: BottleTypesService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: CanDeactivateDialogService, useValue: { canDeactivate: jest.fn() } },
        { provide: AuthService, useValue: { getToken: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
