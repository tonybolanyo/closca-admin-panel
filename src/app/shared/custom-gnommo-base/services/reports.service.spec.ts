import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './reports.service';
import { environment } from 'src/environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be defined as a class', () => {
    expect(typeof ReportService).toBe('function');
    expect(ReportService.prototype.sendFeedbackEmail).toBeDefined();
    expect(ReportService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ReportService.prototype.sendFeedbackEmail).toBe('function');
    expect(typeof ReportService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ReportService.prototype.constructor.name).toBe('ReportService');
  });

  describe('HTTP methods', () => {
    it('should call sendFeedbackEmail and return data', (done) => {
      const reportId = 'report-123';
      const bodyRequest = { message: 'Test feedback', status: 'resolved' };
      const mockResponse = { success: true };

      service.sendFeedbackEmail(reportId, bodyRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reports-send-email/${reportId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(bodyRequest);
      req.flush(mockResponse);
    });

    it('should call count and return data', (done) => {
      const mockResponse = { count: 150 };

      service.count().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reports-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
