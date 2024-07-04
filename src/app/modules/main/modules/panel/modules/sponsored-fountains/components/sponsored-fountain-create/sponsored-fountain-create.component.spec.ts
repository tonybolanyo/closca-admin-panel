import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredFountainCreateComponent } from './sponsored-fountain-create.component';

describe('SponsoredFountainCreateComponent', () => {
  let component: SponsoredFountainCreateComponent;
  let fixture: ComponentFixture<SponsoredFountainCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
