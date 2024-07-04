import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCsvResponseDialogComponent } from './challenge-csv-response-dialog.component';

describe('ChallengeCsvResponseDialog', () => {
  let component: ChallengeCsvResponseDialogComponent;
  let fixture: ComponentFixture<ChallengeCsvResponseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeCsvResponseDialogComponent ]
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
