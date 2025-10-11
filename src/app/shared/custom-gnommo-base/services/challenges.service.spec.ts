import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChallengeService } from './challenges.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChallengeService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ChallengeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ChallengeService).toBe('function');
    expect(ChallengeService.prototype.updateOrder).toBeDefined();
    expect(ChallengeService.prototype.count).toBeDefined();
    expect(ChallengeService.prototype.pause).toBeDefined();
    expect(ChallengeService.prototype.createMultipart).toBeDefined();
    expect(ChallengeService.prototype.updateMultipart).toBeDefined();
    expect(ChallengeService.prototype.getUsersTarget).toBeDefined();
    expect(ChallengeService.prototype.getMetrics).toBeDefined();
    expect(ChallengeService.prototype.getRanking).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ChallengeService.prototype.updateOrder).toBe('function');
    expect(typeof ChallengeService.prototype.count).toBe('function');
    expect(typeof ChallengeService.prototype.pause).toBe('function');
  });

  describe('HTTP methods', () => {
    it('should call updateOrder and return data', (done) => {
      const testData = { order: [1, 2, 3] };
      const mockResponse = { success: true };

      service.updateOrder(testData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-update-order`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 42 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call pause and return data', (done) => {
      const challengeId = 'challenge-123';
      const mockResponse = { success: true };

      service.pause(challengeId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-pause/${challengeId}`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockResponse);
    });

    it('should call getUsersTarget and return data', (done) => {
      const challengeId = 'challenge-123';
      const mockResponse = [{ userId: 'user-1' }];

      service.getUsersTarget(challengeId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge/${challengeId}/users-target-csv`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getMetrics and return data', (done) => {
      const challengeId = 'challenge-123';
      const mockResponse = [{ metric: 'value' }];

      service.getMetrics(challengeId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-metrics/${challengeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call getRanking and return data', (done) => {
      const challengeId = 'challenge-123';
      const mockResponse = [{ rank: 1 }];

      service.getRanking(challengeId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-ranking/${challengeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call createMultipart with FormData', (done) => {
      const formData = new FormData();
      formData.append('test', 'value');
      const mockResponse = { success: true };

      service.createMultipart(formData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      req.flush(mockResponse);
    });

    it('should call updateMultipart with FormData and csvMode', (done) => {
      const challengeId = 'challenge-123';
      const formData = new FormData();
      formData.append('test', 'value');
      const csvMode = 'append';
      const mockResponse = { success: true };

      service.updateMultipart(challengeId, formData, csvMode).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge/${challengeId}/update-with-csv`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      expect(req.request.headers.get('csvMode')).toBe(csvMode);
      req.flush(mockResponse);
    });
  });
});
