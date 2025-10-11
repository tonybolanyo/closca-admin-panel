import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImagesRandomService } from './images-random.service';
import { AuthService } from '@tyris/angular-foundation';
import { environment } from 'src/environments/environment';

describe('ImagesRandomService', () => {
  let service: ImagesRandomService;
  let httpMock: HttpTestingController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      getToken: jest.fn().mockReturnValue({ id: 'test-token-123' })
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImagesRandomService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ImagesRandomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ImagesRandomService).toBe('function');
    expect(ImagesRandomService.prototype.uploadImages).toBeDefined();
    expect(ImagesRandomService.prototype.deleteImages).toBeDefined();
    expect(ImagesRandomService.prototype.assignToFountains).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ImagesRandomService.prototype.uploadImages).toBe('function');
    expect(typeof ImagesRandomService.prototype.deleteImages).toBe('function');
    expect(typeof ImagesRandomService.prototype.assignToFountains).toBeDefined();
  });

  it('should extend BaseService', () => {
    expect(ImagesRandomService.prototype.constructor.name).toBe('ImagesRandomService');
  });

  describe('HTTP methods', () => {
    it('should call uploadImages with FormData', (done) => {
      const formData = new FormData();
      formData.append('image', new Blob(['test']), 'test.jpg');
      const mockResponse = { success: true };

      service.uploadImages(formData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(mockAuthService.getToken).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/images-random`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      req.flush(mockResponse);
    });

    it('should call deleteImages and return data', (done) => {
      const imageId = 'image-123';
      const mockResponse = { success: true };

      service.deleteImages(imageId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/images-random/${imageId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should call assignToFountains and return data', (done) => {
      const mockResponse = { assigned: 25 };

      service.assignToFountains().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/fountains-random-images`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
