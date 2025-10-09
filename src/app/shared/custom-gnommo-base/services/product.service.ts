import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../models';

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(http: HttpClient,
        private authService: AuthService) {
        super(http,
            environment.apiUrl,
            'products');
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public editProduct(productId?: string, values?: any, headers?: any): Observable<any> {
        // console.log(values)
        return this.http.patch(`${this.url}/${this.endpoint}/${productId}`, values, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public editProductsStatus(values?: any, headers?: any): Observable<any> {
        return this.http.patch(`${this.url}/${this.endpoint}`, values, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public deleteProducts(values?: any, headers?: any): Observable<any> {
        const httpOptions = {
            headers: headers,
            body: { ids: values }
        };

        return this.http.delete(`${this.url}/${this.endpoint}`, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public uploadRewardCodes(formData, productId?: string, headers?: any): Observable<any> {
        /* Custom httpOptions used to upload transport
        documentation with multipart/form-data header */
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken().id}`,
                'Accept': 'application/json',
                'Accept-language': 'es'
            })
        };

        return this.http.post(`${this.url}/${this.endpoint}-reward-codes/${productId}`, formData, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public uploadProductImages(formData, productId?: string, headers?: any): Observable<any> {
        /* Custom httpOptions used to upload transport
        documentation with multipart/form-data header */
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken().id}`,
                'Accept': 'application/json',
                'Accept-language': 'es',
                'destination': 'products'
            })
        };

        return this.http.post(`${this.url}/${this.endpoint}-upload-images/${productId}`, formData, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public deleteProductImages(productId?: string, imageKey?: string, imageId?: string, headers?: any): Observable<any> {
        // tslint:disable-next-line: max-line-length
        return this.http.delete(`${this.url}/${this.endpoint}-delete-image/${productId}/${imageKey}/${imageId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public deleteRewardCodes(values?: any, productId?: string, headers?: any): Observable<any> {
        const httpOptions = {
            headers: headers,
            body: { rewardCode: values }
        };
        return this.http.delete(`${this.url}/${this.endpoint}-reward-codes/${productId}`, httpOptions)
            .pipe(
                map((data: any) => data));
    }

}
