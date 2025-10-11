import { TestBed, waitForAsync } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AppComponent } from './app.component';
import { LoggedUserService } from './shared/services/logged-user.service';

describe('AppComponent (Jest)', () => {
  let component: AppComponent;
  let fixture: any;
  let mockLoggedUserService: any;
  let mockBottomSheet: any;

  beforeEach(waitForAsync(() => {
    mockLoggedUserService = {
      checkLoggedUser: jest.fn()
    };

    mockBottomSheet = {
      open: jest.fn().mockReturnValue({
        afterDismissed: jest.fn().mockReturnValue({
          subscribe: jest.fn()
        })
      })
    };

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: MatBottomSheet, useValue: mockBottomSheet }
      ]
    })
    .overrideComponent(AppComponent, {
      set: {
        templateUrl: undefined,
        template: '<div></div>',
        styleUrls: []
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkLoggedUser on construction', () => {
    expect(mockLoggedUserService.checkLoggedUser).toHaveBeenCalled();
  });

  it('should open bottom sheet when checkAllowCookies is called', () => {
    component.checkAllowCookies();
    expect(mockBottomSheet.open).toHaveBeenCalled();
  });
});