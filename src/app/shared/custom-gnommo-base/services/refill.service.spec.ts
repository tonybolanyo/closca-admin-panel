import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RefillService } from './refill.service';
import { environment } from 'src/environments/environment';

describe('RefillService', () => {
  let service: RefillService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RefillService]
    });

    service = TestBed.inject(RefillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof RefillService).toBe('function');
    expect(RefillService.prototype.userRefills).toBeDefined();
    expect(RefillService.prototype.corporateRefills).toBeDefined();
    expect(RefillService.prototype.countCorporateRefills).toBeDefined();
    expect(RefillService.prototype.fountainRefills).toBeDefined();
    expect(RefillService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof RefillService.prototype.userRefills).toBe('function');
    expect(typeof RefillService.prototype.corporateRefills).toBe('function');
    expect(typeof RefillService.prototype.countCorporateRefills).toBe('function');
    expect(typeof RefillService.prototype.fountainRefills).toBe('function');
    expect(typeof RefillService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(RefillService.prototype.constructor.name).toBe('RefillService');
  });

  describe('HTTP methods', () => {
    it('should call userRefills and return data', (done) => {
      const userId = 'user-123';
      const mockResponse = [{ id: 'refill-1', amount: 500 }];

      service.userRefills(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refills-user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call corporateRefills and return data', (done) => {
      const corporateId = 'corp-123';
      const mockResponse = [{ id: 'refill-1', corporate: 'corp-123' }];

      service.corporateRefills(corporateId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refills-by-corporate/${corporateId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call countCorporateRefills and return data', (done) => {
      const corporateId = 'corp-123';
      const mockResponse = { count: 250 };

      service.countCorporateRefills(corporateId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refills-by-corporate/${corporateId}/count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call fountainRefills and return data', (done) => {
      const fountainId = 'fountain-123';
      const mockResponse = [{ id: 'refill-1', fountain: 'fountain-123' }];

      service.fountainRefills(fountainId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refills-fountain/${fountainId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 1500 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refills-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
