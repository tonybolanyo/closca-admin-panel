import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OnboardingService } from './onboarding.service';
import { environment } from 'src/environments/environment';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OnboardingService]
    });

    service = TestBed.inject(OnboardingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof OnboardingService).toBe('function');
    expect(OnboardingService.prototype.updateOnboarding).toBeDefined();
    expect(OnboardingService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof OnboardingService.prototype.updateOnboarding).toBe('function');
    expect(typeof OnboardingService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(OnboardingService.prototype.constructor.name).toBe('OnboardingService');
  });

  describe('HTTP methods', () => {
    it('should call updateOnboarding and return data', (done) => {
      const onboardingId = 'onb-123';
      const values = { title: 'Updated Onboarding' };
      const mockResponse = { success: true };

      service.updateOnboarding(onboardingId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/onboardings/${onboardingId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 8 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/onboardings-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
