import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredFountainDetailComponent } from './sponsored-fountain-detail.component';

describe('SponsoredFountainDetailComponent', () => {
  let component: SponsoredFountainDetailComponent;
  let fixture: ComponentFixture<SponsoredFountainDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
