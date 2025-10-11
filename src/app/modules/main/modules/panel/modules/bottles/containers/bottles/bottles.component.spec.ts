import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BottlesComponent } from './bottles.component';

describe('BrandsComponent', () => {
  let component: BottlesComponent;
  let fixture: ComponentFixture<BottlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ BottlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
