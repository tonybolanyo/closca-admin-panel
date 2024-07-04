import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCrudListComponent } from './example-crud-list.component';

describe('ExampleCrudListComponent', () => {
  let component: ExampleCrudListComponent;
  let fixture: ComponentFixture<ExampleCrudListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCrudListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCrudListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
