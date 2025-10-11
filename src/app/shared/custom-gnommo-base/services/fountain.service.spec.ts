import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FountainService } from './fountain.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('FountainService', () => {
  let service: FountainService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FountainService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(FountainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof FountainService).toBe('function');
    expect(FountainService.prototype.count).toBeDefined();
    expect(FountainService.prototype.getByLocation).toBeDefined();
    expect(FountainService.prototype.getMetrics).toBeDefined();
    expect(FountainService.prototype.getCSV).toBeDefined();
    expect(FountainService.prototype.getSimpleCSV).toBeDefined();
    expect(FountainService.prototype.createWithCSV).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof FountainService.prototype.count).toBe('function');
    expect(typeof FountainService.prototype.getByLocation).toBe('function');
    expect(typeof FountainService.prototype.getMetrics).toBe('function');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 100 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getByLocation and return data', (done) => {
      const mockResponse = [{ id: 'f1', lat: 40.0, lng: -3.0 }];

      service.getByLocation().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-location`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getMetrics and return data', (done) => {
      const mockResponse = [{ metric: 'views', value: 500 }];

      service.getMetrics().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-metrics`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getCSV and return data', (done) => {
      const mockResponse = [{ csv: 'data' }];

      service.getCSV().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-export-csv`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getSimpleCSV and return data', (done) => {
      const mockResponse = [{ csv: 'simple-data' }];

      service.getSimpleCSV().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-export-simple-csv`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call createWithCSV with FormData and corporateId', (done) => {
      const corporateId = 'corp-123';
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'fountains.csv');
      const mockResponse = { success: true };

      service.createWithCSV(formData, corporateId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-create-csv`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      expect(req.request.headers.get('corporateId')).toBe(corporateId);
      req.flush(mockResponse);
    });
  });
});
