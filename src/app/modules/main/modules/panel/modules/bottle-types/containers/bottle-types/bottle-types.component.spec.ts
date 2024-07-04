import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottleTypesComponent } from './bottle-types.component';

describe('BrandsComponent', () => {
  let component: BottleTypesComponent;
  let fixture: ComponentFixture<BottleTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
