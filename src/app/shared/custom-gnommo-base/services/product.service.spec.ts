import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ProductService).toBe('function');
    expect(ProductService.prototype.count).toBeDefined();
    expect(ProductService.prototype.editProduct).toBeDefined();
    expect(ProductService.prototype.editProductsStatus).toBeDefined();
    expect(ProductService.prototype.deleteProducts).toBeDefined();
    expect(ProductService.prototype.uploadRewardCodes).toBeDefined();
    expect(ProductService.prototype.uploadProductImages).toBeDefined();
    expect(ProductService.prototype.deleteProductImages).toBeDefined();
    expect(ProductService.prototype.deleteRewardCodes).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ProductService.prototype.count).toBe('function');
    expect(typeof ProductService.prototype.editProduct).toBe('function');
    expect(typeof ProductService.prototype.editProductsStatus).toBe('function');
    expect(typeof ProductService.prototype.deleteProducts).toBe('function');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 50 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call editProduct and return data', (done) => {
      const productId = 'prod-123';
      const values = { name: 'Updated Product' };
      const mockResponse = { success: true };

      service.editProduct(productId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/${productId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });

    it('should call editProductsStatus and return data', (done) => {
      const values = { status: 'active' };
      const mockResponse = { success: true };

      service.editProductsStatus(values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockResponse);
    });

    it('should call deleteProducts and return data', (done) => {
      const values = ['prod-1', 'prod-2'];
      const mockResponse = { success: true };

      service.deleteProducts(values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ ids: values });
      req.flush(mockResponse);
    });

    it('should call uploadRewardCodes with FormData', (done) => {
      const productId = 'prod-123';
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'codes.csv');
      const mockResponse = { success: true };

      service.uploadRewardCodes(formData, productId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products-reward-codes/${productId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      req.flush(mockResponse);
    });

    it('should call uploadProductImages with FormData', (done) => {
      const productId = 'prod-123';
      const formData = new FormData();
      formData.append('image', new Blob(['test']), 'image.jpg');
      const mockResponse = { success: true };

      service.uploadProductImages(formData, productId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products-upload-images/${productId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      expect(req.request.headers.get('destination')).toBe('products');
      req.flush(mockResponse);
    });

    it('should call deleteProductImages and return data', (done) => {
      const productId = 'prod-123';
      const imageKey = 'main';
      const imageId = 'img-456';
      const mockResponse = { success: true };

      service.deleteProductImages(productId, imageKey, imageId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products-delete-image/${productId}/${imageKey}/${imageId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should call deleteRewardCodes and return data', (done) => {
      const productId = 'prod-123';
      const values = ['code-1', 'code-2'];
      const mockResponse = { success: true };

      service.deleteRewardCodes(values, productId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products-reward-codes/${productId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ rewardCode: values });
      req.flush(mockResponse);
    });
  });
});
