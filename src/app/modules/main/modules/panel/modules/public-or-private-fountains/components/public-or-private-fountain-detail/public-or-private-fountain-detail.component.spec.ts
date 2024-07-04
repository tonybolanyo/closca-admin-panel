import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrPrivateFountainDetailComponent } from './public-or-private-fountain-detail.component';

describe('FountainDetailComponent', () => {
  let component: PublicOrPrivateFountainDetailComponent;
  let fixture: ComponentFixture<PublicOrPrivateFountainDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOrPrivateFountainDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrPrivateFountainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
