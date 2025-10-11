import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserRatingsService } from './user-ratings.service';
import { environment } from 'src/environments/environment';

describe('UserRatingsService', () => {
  let service: UserRatingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserRatingsService]
    });

    service = TestBed.inject(UserRatingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof UserRatingsService).toBe('function');
    expect(UserRatingsService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof UserRatingsService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(UserRatingsService.prototype.constructor.name).toBe('UserRatingsService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 850 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user-ratings-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
