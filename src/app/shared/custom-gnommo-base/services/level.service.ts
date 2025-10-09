import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '@tyris/angular-foundation-libs';
import { Level } from '../models/level.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LevelService extends BaseService<Level>  {

        constructor(http: HttpClient) {
                super(http,
                        environment.apiUrl,
                        'levels');
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

}
