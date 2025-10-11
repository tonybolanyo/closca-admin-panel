import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExampleCrudComponent } from './example-crud.component';

describe('ExampleCrudComponent', () => {
  let component: ExampleCrudComponent;
  let fixture: ComponentFixture<ExampleCrudComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ExampleCrudComponent ]
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
