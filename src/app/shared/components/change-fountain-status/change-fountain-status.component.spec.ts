import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFountainStatusComponent } from './change-fountain-status.component';

describe('ChangeFountainStatusComponent', () => {
  let component: ChangeFountainStatusComponent;
  let fixture: ComponentFixture<ChangeFountainStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeFountainStatusComponent ]
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
