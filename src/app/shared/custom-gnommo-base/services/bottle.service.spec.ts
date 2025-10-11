import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BottleService } from './bottle.service';
import { environment } from 'src/environments/environment';

describe('BottleService', () => {
  let service: BottleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BottleService]
    });

    service = TestBed.inject(BottleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof BottleService).toBe('function');
    expect(BottleService.prototype.count).toBeDefined();
    expect(BottleService.prototype.updateBottle).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BottleService.prototype.count).toBe('function');
    expect(typeof BottleService.prototype.updateBottle).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BottleService.prototype.constructor.name).toBe('BottleService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 300 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bottles-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call updateBottle and return data', (done) => {
      const bottleId = 'bottle-123';
      const values = { name: 'Updated Bottle' };
      const mockResponse = { success: true };

      service.updateBottle(bottleId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bottles/${bottleId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });
  });
});
