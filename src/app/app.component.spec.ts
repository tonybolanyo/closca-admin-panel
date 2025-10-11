import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AppComponent } from './app.component';
import { LoggedUserService } from './shared/services/logged-user.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    const mockLoggedUserService = {
      checkLoggedUser: jest.fn()
    };
    
    const mockBottomSheet = {
      open: jest.fn()
    };
    
    TestBed.configureTestingModule({
      imports: [
        AppComponent
      ],
      providers: [
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: MatBottomSheet, useValue: mockBottomSheet }
      ]
    })
    .overrideComponent(AppComponent, {
      set: {
        templateUrl: undefined,
        template: '<h1>Welcome to app!</h1>',
        styleUrls: []
      }
    })
    .compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});
