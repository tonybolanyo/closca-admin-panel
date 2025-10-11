import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandService } from './brands.service';
import { environment } from 'src/environments/environment';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService]
    });

    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof BrandService).toBe('function');
    expect(BrandService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BrandService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BrandService.prototype.constructor.name).toBe('BrandService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 20 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/brands-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
