import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FountainsImpactListComponent } from './fountains-impact-list.component';

describe('FountainsImpactListComponent', () => {
  let component: FountainsImpactListComponent;
  let fixture: ComponentFixture<FountainsImpactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FountainsImpactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainsImpactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
