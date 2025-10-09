import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation-libs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductType } from '../models';

@Injectable()
export class ProductTypesService extends BaseService<ProductType> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'product-types');
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public editProductType(productTypeId?: string, values?: any, headers?: any): Observable<any> {
        return this.http.patch(`${this.url}/${this.endpoint}/${productTypeId}`, values, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

}
