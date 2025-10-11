import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ChangeFountainStatusComponent } from './change-fountain-status.component';

describe('ChangeFountainStatusComponent', () => {
  let component: ChangeFountainStatusComponent;
  let fixture: ComponentFixture<ChangeFountainStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ChangeFountainStatusComponent ],
      imports: [ 
        ReactiveFormsModule, 
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        UntypedFormBuilder,
        DatePipe,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn() } }
      ]
    })
    .overrideComponent(ChangeFountainStatusComponent, {
      set: {
        styleUrls: []
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFountainStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
