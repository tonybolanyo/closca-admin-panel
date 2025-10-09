import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Report } from '../models/report.model';

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