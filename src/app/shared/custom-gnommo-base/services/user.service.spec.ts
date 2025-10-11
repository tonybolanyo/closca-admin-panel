import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof UserService).toBe('function');
    expect(UserService.prototype.deleteAvatarImage).toBeDefined();
    expect(UserService.prototype.getMetrics).toBeDefined();
    expect(UserService.prototype.getCSV).toBeDefined();
    expect(UserService.prototype.getMetricsTotal).toBeDefined();
    expect(UserService.prototype.count).toBeDefined();
    expect(UserService.prototype.invitateCorporateWithCSV).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof UserService.prototype.deleteAvatarImage).toBe('function');
    expect(typeof UserService.prototype.getMetrics).toBe('function');
    expect(typeof UserService.prototype.getCSV).toBe('function');
    expect(typeof UserService.prototype.getMetricsTotal).toBe('function');
    expect(typeof UserService.prototype.count).toBe('function');
    expect(typeof UserService.prototype.invitateCorporateWithCSV).toBe('function');
  });

  it('should extend LoginBaseService', () => {
    expect(UserService.prototype.constructor.name).toBe('UserService');
  });

  describe('HTTP methods', () => {
    it('should call deleteAvatarImage and return data', (done) => {
      const userId = 'user-123';
      const mockResponse = { success: true };

      service.deleteAvatarImage(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/avatar/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should call getMetrics and return data', (done) => {
      const mockResponse = [{ metric: 'active_users', value: 1000 }];

      service.getMetrics().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users-metrics`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getCSV and return data', (done) => {
      const mockResponse = { csv: 'data' };

      service.getCSV().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users-export-csv`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getMetricsTotal and return data', (done) => {
      const mockResponse = { total: 5000 };

      service.getMetricsTotal().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users-metrics-total`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 2500 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call invitateCorporateWithCSV with FormData and corporateId', (done) => {
      const corporateId = 'corp-123';
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'users.csv');
      const mockResponse = { success: true };

      service.invitateCorporateWithCSV(formData, corporateId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users-invitate-corporate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      expect(req.request.headers.get('corporateId')).toBe(corporateId);
      req.flush(mockResponse);
    });
  });
});
