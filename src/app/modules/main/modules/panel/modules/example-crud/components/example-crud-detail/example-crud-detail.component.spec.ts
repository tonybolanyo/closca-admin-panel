import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCrudDetailComponent } from './example-crud-detail.component';

describe('ExampleCrudDetailComponent', () => {
  let component: ExampleCrudDetailComponent;
  let fixture: ComponentFixture<ExampleCrudDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCrudDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCrudDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
