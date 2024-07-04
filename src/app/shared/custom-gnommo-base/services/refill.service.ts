import { Injectable } from '@angular/core';
import { BaseService } from '@gnommostudios/ng-gnommo-base';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Refill } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class RefillService extends BaseService<Refill> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'refills');
    }

    public userRefills(userId: string, headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-user/${userId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public corporateRefills(corporateId: string, headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-by-corporate/${corporateId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public countCorporateRefills(corporateId: string, headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-by-corporate/${corporateId}/count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public fountainRefills(fountainId: string, headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-fountain/${fountainId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
