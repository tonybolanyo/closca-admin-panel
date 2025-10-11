import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';
import { MainComponent } from './main.component';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let mockCorporateService: jest.Mocked<Partial<CorporateService>>;
  let mockLoggedUserService: jest.Mocked<Partial<LoggedUserService>>;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockNgxLoader: jest.Mocked<Partial<NgxUiLoaderService>>;
  let formBuilder: UntypedFormBuilder;

  beforeEach(() => {
    mockCorporateService = {
      getAll: jest.fn().mockReturnValue(of([
        { _id: 'corp-1', code: 'CLOSCA', name: 'Closca' },
        { _id: 'corp-2', code: 'OTHER', name: 'Other Corp' }
      ]))
    };

    mockLoggedUserService = {
      getLoggedUser: jest.fn().mockReturnValue(of({
        _id: 'user-123',
        userName: 'testuser',
        role: 'ADMIN'
      })),
      setLoggedUser: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true)
    };

    mockNgxLoader = {
      start: jest.fn(),
      stop: jest.fn()
    };

    formBuilder = new UntypedFormBuilder();

    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        { provide: CorporateService, useValue: mockCorporateService },
        { provide: LoggedUserService, useValue: mockLoggedUserService },
        { provide: Router, useValue: mockRouter },
        { provide: NgxUiLoaderService, useValue: mockNgxLoader },
        { provide: UntypedFormBuilder, useValue: formBuilder }
      ]
    });

    const fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have router definitions', () => {
    expect(component.routerDefinitions).toBeDefined();
  });

  it('should build form on initialization', () => {
    expect(component.corporateSelectForm).toBeDefined();
    expect(component.corporateSelectForm.get('corporateInfo')).toBeDefined();
  });

  it('should get corporates on initialization', () => {
    expect(mockCorporateService.getAll).toHaveBeenCalled();
    expect(component.corporates).toBeDefined();
  });

  it('should get logged user on initialization', () => {
    expect(mockLoggedUserService.getLoggedUser).toHaveBeenCalled();
  });

  it('should have corporates array initialized', () => {
    expect(Array.isArray(component.corporates)).toBe(true);
  });

  it('should have corporateSelectForm with corporateInfo group', () => {
    const corporateInfo = component.corporateSelectForm.get('corporateInfo');
    expect(corporateInfo).toBeDefined();
    expect(corporateInfo.get('_id')).toBeDefined();
    expect(corporateInfo.get('code')).toBeDefined();
  });
});
