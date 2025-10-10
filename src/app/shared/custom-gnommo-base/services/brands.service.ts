import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/brand.model';

@Injectable()
export class BrandService extends BaseService<Brand> {
    constructor(http: HttpClient) {
        super(http);
        this.setApiConfig(environment.apiUrl, 'brands');
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
