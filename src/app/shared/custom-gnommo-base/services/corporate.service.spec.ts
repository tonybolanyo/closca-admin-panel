import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CorporateService } from './corporate.service';
import { environment } from 'src/environments/environment';

describe('CorporateService', () => {
  let service: CorporateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CorporateService]
    });

    service = TestBed.inject(CorporateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof CorporateService).toBe('function');
    expect(CorporateService.prototype.updateCorporate).toBeDefined();
    expect(CorporateService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof CorporateService.prototype.updateCorporate).toBe('function');
    expect(typeof CorporateService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(CorporateService.prototype.constructor.name).toBe('CorporateService');
  });

  describe('HTTP methods', () => {
    it('should call updateCorporate and return data', (done) => {
      const corporateId = 'corp-123';
      const values = { name: 'Updated Corp' };
      const mockResponse = { success: true };

      service.updateCorporate(corporateId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/corporate/${corporateId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 75 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/corporate-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
