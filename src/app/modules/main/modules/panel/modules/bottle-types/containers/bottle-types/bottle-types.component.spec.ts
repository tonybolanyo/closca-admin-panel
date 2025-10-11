import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BottleTypesComponent } from './bottle-types.component';

describe('BrandsComponent', () => {
  let component: BottleTypesComponent;
  let fixture: ComponentFixture<BottleTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ BottleTypesComponent ]
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
