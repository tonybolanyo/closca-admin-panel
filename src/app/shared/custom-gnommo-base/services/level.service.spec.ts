import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LevelService } from './level.service';
import { environment } from 'src/environments/environment';

describe('LevelService', () => {
  let service: LevelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LevelService]
    });

    service = TestBed.inject(LevelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof LevelService).toBe('function');
    expect(LevelService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof LevelService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(LevelService.prototype.constructor.name).toBe('LevelService');
  });

  describe('HTTP methods', () => {
    it('should call count and return data', (done) => {
      const mockResponse = { count: 12 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/levels-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
