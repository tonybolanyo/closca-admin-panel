import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { of } from 'rxjs';

import { LevelDetailComponent } from './level-detail.component';
import { LevelService } from 'src/app/shared/custom-gnommo-base/services/level.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { AuthService } from '@tyris/angular-foundation';

describe('LevelDetailComponent', () => {
  let component: LevelDetailComponent;
  let fixture: ComponentFixture<LevelDetailComponent>;

  beforeEach(async(() => {
    const mockLevelService = {
      getById: jest.fn().mockReturnValue(of({ data: {} })),
      create: jest.fn().mockReturnValue(of({ data: {} })),
      update: jest.fn().mockReturnValue(of({ data: {} }))
    };

    TestBed.configureTestingModule({
      declarations: [ LevelDetailComponent ],
      imports: [ ReactiveFormsModule, MatButtonToggleModule ],
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
        { provide: LevelService, useValue: mockLevelService },
        { provide: CanDeactivateDialogService, useValue: { canDeactivate: jest.fn() } },
        { provide: AuthService, useValue: { getToken: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
