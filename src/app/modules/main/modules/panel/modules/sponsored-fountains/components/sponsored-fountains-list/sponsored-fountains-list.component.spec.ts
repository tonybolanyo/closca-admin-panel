import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredFountainsListComponent } from './sponsored-fountains-list.component';

describe('SponsoredFountainsListComponent', () => {
  let component: SponsoredFountainsListComponent;
  let fixture: ComponentFixture<SponsoredFountainsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
