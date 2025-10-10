import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Level } from '../models/level.model';

@Injectable()
export class LevelService extends BaseService<Level> {

        constructor(http: HttpClient) {
                super(http);
                this.setApiConfig(environment.apiUrl, 'levels');
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

}
