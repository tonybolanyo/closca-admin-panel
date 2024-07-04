import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOrPrivateFountainsListComponent } from './public-or-private-fountains-list.component';

describe('FountainsListComponent', () => {
  let component: PublicOrPrivateFountainsListComponent;
  let fixture: ComponentFixture<PublicOrPrivateFountainsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOrPrivateFountainsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrPrivateFountainsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
