import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '@gnommostudios/ng-gnommo-base';
import { Corporate } from '../models/corporate.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CorporateService extends BaseService<Corporate>  {

        constructor(http: HttpClient) {
                super(http,
                        environment.apiUrl,
                        'corporate');
        }

        public updateCorporate(corporateId?: string, values?: any, headers?: any): Observable<any> {
                // console.log(`${this.url}/${this.endpoint}/${corporateId}`);
                return this.http.patch(`${this.url}/${this.endpoint}/${corporateId}`, values, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }
}
