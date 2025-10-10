import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BottleType } from '../models/bottle-type.model';

@Injectable()
export class BottleTypesService extends BaseService<BottleType> {

        constructor(http: HttpClient) {
                super(http);
                this.setApiConfig(environment.apiUrl, 'bottle-types');
        }

        public updateBottleType(bottleTypeId?: string, values?: any, headers?: any): Observable<any> {
                return this.http.patch(`${this.url}/${this.endpoint}/${bottleTypeId}`, values, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

}
