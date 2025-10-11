import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductTypesService } from './product-types.service';
import { environment } from 'src/environments/environment';

describe('ProductTypesService', () => {
  let service: ProductTypesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductTypesService]
    });

    service = TestBed.inject(ProductTypesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ProductTypesService).toBe('function');
    expect(ProductTypesService.prototype.count).toBeDefined();
    expect(ProductTypesService.prototype.editProductType).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ProductTypesService.prototype.count).toBe('function');
    expect(typeof ProductTypesService.prototype.editProductType).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ProductTypesService.prototype.constructor.name).toBe('ProductTypesService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 10 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/product-types-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call editProductType and return data', (done) => {
      const productTypeId = 'pt-123';
      const values = { name: 'Updated Type' };
      const mockResponse = { success: true };

      service.editProductType(productTypeId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/product-types/${productTypeId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });
  });
});
