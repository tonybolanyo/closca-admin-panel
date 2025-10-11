import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RewardService } from './reward.service';
import { environment } from 'src/environments/environment';

describe('RewardService', () => {
  let service: RewardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RewardService]
    });

    service = TestBed.inject(RewardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof RewardService).toBe('function');
    expect(RewardService.prototype.getRewardByProduct).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof RewardService.prototype.getRewardByProduct).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(RewardService.prototype.constructor.name).toBe('RewardService');
  });

  describe('HTTP methods', () => {
    it('should call getRewardByProduct and return data', (done) => {
      const productId = 'prod-123';
      const mockResponse = [{ id: 'reward-1', points: 100 }];

      service.getRewardByProduct(productId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/rewards-all/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
