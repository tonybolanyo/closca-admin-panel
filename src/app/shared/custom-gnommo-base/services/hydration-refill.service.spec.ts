import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HydrationRefillService } from './hydration-refill.service';
import { environment } from 'src/environments/environment';

describe('HydrationRefillService', () => {
  let service: HydrationRefillService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HydrationRefillService]
    });

    service = TestBed.inject(HydrationRefillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof HydrationRefillService).toBe('function');
    expect(HydrationRefillService.prototype.userRefills).toBeDefined();
    expect(HydrationRefillService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof HydrationRefillService.prototype.userRefills).toBe('function');
    expect(typeof HydrationRefillService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(HydrationRefillService.prototype.constructor.name).toBe('HydrationRefillService');
  });

  describe('HTTP methods', () => {
    it('should call userRefills and return data', (done) => {
      const mockResponse = [{ id: 'hr-1', amount: 750 }];

      service.userRefills().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/hydration-refills`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 3000 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/hydration-refills-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
