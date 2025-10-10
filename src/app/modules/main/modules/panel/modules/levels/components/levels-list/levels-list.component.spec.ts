import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { LevelsListComponent } from './levels-list.component';
import { LevelService } from 'src/app/shared/custom-gnommo-base/services/level.service';

describe('LevelsListComponent', () => {
  let component: LevelsListComponent;
  let fixture: ComponentFixture<LevelsListComponent>;

  beforeEach(waitForAsync(() => {
    const mockLevelService = {
      getAll: jest.fn().mockReturnValue(of({ data: [] })),
      count: jest.fn().mockReturnValue(of({ count: 0 }))
    };

    TestBed.configureTestingModule({
      declarations: [ LevelsListComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: LevelService, useValue: mockLevelService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelsListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
