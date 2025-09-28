import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation-libs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class HydrationRefillService extends BaseService<any> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'hydration-refills');
    }

    public userRefills(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
