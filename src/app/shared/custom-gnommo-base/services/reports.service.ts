import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation-libs';
import { Report } from '../models/report.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportService extends BaseService<Report> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'reports');
    }

    public sendFeedbackEmail(reportId: string, bodyRequest: any, headers?: any): Observable<any> {
        return this.http.post(`${this.url}/${this.endpoint}-send-email/${reportId}`, bodyRequest, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}