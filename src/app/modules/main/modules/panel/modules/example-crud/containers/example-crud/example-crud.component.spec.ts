import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCrudComponent } from './example-crud.component';

describe('ExampleCrudComponent', () => {
  let component: ExampleCrudComponent;
  let fixture: ComponentFixture<ExampleCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
