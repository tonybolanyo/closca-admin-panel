import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bottle } from '../models/bottle.model';

@Injectable()
export class BottleService extends BaseService<Bottle> {

        constructor(http: HttpClient) {
                super(http);
                this.setApiConfig(environment.apiUrl, 'bottles');
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public updateBottle(bottleId?: string, values?: any, headers?: any): Observable<any> {
                return this.http.patch(`${this.url}/${this.endpoint}/${bottleId}`, values, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

}
