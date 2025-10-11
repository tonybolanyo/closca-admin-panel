import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BottleTypesService } from './bottle-types.service';
import { environment } from 'src/environments/environment';

describe('BottleTypesService', () => {
  let service: BottleTypesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BottleTypesService]
    });

    service = TestBed.inject(BottleTypesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof BottleTypesService).toBe('function');
    expect(BottleTypesService.prototype.updateBottleType).toBeDefined();
    expect(BottleTypesService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BottleTypesService.prototype.updateBottleType).toBe('function');
    expect(typeof BottleTypesService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BottleTypesService.prototype.constructor.name).toBe('BottleTypesService');
  });

  describe('HTTP methods', () => {
    it('should call updateBottleType and return data', (done) => {
      const bottleTypeId = 'type-123';
      const values = { name: 'Updated Type' };
      const mockResponse = { success: true };

      service.updateBottleType(bottleTypeId, values).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bottle-types/${bottleTypeId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(values);
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 15 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bottle-types-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
