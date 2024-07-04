import { Injectable } from '@angular/core';
import { BaseService } from '@gnommostudios/ng-gnommo-base';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/brand.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BrandService extends BaseService<Brand> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'brands');
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
