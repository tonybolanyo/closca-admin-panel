import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PublicOrPrivateFountainsComponent } from './public-or-private-fountains.component';

describe('PublicOrPrivateFountainsComponent', () => {
  let component: PublicOrPrivateFountainsComponent;
  let fixture: ComponentFixture<PublicOrPrivateFountainsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PublicOrPrivateFountainsComponent ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrPrivateFountainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
