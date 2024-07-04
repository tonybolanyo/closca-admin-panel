import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottleTypeDetailComponent } from './bottle-type-detail.component';

describe('BottleTypeDetailComponent', () => {
  let component: BottleTypeDetailComponent;
  let fixture: ComponentFixture<BottleTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
