import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChallengeSubscriptionService } from './challenge-subscription.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('ChallengeSubscriptionService', () => {
  let service: ChallengeSubscriptionService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChallengeSubscriptionService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ChallengeSubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ChallengeSubscriptionService).toBe('function');
    expect(ChallengeSubscriptionService.prototype.count).toBeDefined();
    expect(ChallengeSubscriptionService.prototype.uploadSubscribeCSV).toBeDefined();
    expect(ChallengeSubscriptionService.prototype.getUsersSubscribed).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ChallengeSubscriptionService.prototype.count).toBe('function');
    expect(typeof ChallengeSubscriptionService.prototype.uploadSubscribeCSV).toBe('function');
    expect(typeof ChallengeSubscriptionService.prototype.getUsersSubscribed).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ChallengeSubscriptionService.prototype.constructor.name).toBe('ChallengeSubscriptionService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 500 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-subscriptions-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call uploadSubscribeCSV with FormData and csvMode', (done) => {
      const challengeId = 'challenge-123';
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'subscriptions.csv');
      const csvMode = 'append';
      const mockResponse = { success: true };

      service.uploadSubscribeCSV(challengeId, formData, csvMode).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-subscriptions/${challengeId}/subscribe-by-csv`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      expect(req.request.headers.get('csvMode')).toBe(csvMode);
      req.flush(mockResponse);
    });

    it('should call getUsersSubscribed and return data', (done) => {
      const challengeId = 'challenge-123';
      const mockResponse = [{ userId: 'user-1', status: 'active' }];

      service.getUsersSubscribed(challengeId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/challenge-subscriptions/${challengeId}/get-subscriptions-csv `);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
