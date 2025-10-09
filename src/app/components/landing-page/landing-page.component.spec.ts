import { LandingPageComponent } from './landing-page.component';
import { Router } from '@angular/router';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };
  });

  it('should create', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'axa' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    expect(component).toBeTruthy();
  });

  it('should set AXA logo for axa company', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'axa' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    expect(component.logo).toBe('/assets/images/peritationCompaniesLogos/axa.png');
    expect(component.peritationCompany).toBe('axa');
  });

  it('should set default logo for onper company', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'onper' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    expect(component.logo).toBe('/assets/images/logo.png');
    expect(component.peritationCompany).toBe('onper');
  });

  it('should set default logo for unknown company', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'unknown' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    expect(component.logo).toBe('/assets/images/logo.png');
    expect(component.peritationCompany).toBe('unknown');
  });

  it('should call ngOnInit without errors', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'axa' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should navigate to login when enterOnper is called', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'axa' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    component.enterOnper();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTER_DEFINITIONS.login]);
  });

  it('should have routerDefinitions set', () => {
    mockActivatedRoute = {
      snapshot: {
        params: { peritationCompany: 'axa' }
      }
    };
    component = new LandingPageComponent(mockActivatedRoute, mockRouter);
    
    expect(component.routerDefinitions).toBe(ROUTER_DEFINITIONS);
  });
});
