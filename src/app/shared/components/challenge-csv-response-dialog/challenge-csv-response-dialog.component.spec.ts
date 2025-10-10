import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ChallengeCsvResponseDialogComponent } from './challenge-csv-response-dialog.component';

describe('ChallengeCsvResponseDialog', () => {
  let component: ChallengeCsvResponseDialogComponent;
  let fixture: ComponentFixture<ChallengeCsvResponseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeCsvResponseDialogComponent ],
      imports: [ MatDialogModule ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .overrideComponent(ChallengeCsvResponseDialogComponent, {
      set: {
        styleUrls: []
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeCsvResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
