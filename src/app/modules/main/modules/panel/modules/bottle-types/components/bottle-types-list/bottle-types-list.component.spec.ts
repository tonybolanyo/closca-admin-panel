import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottleTypesListComponent } from './bottle-types-list.component';

describe('BottleTypesListComponent', () => {
  let component: BottleTypesListComponent;
  let fixture: ComponentFixture<BottleTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
