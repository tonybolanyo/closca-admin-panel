import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService, AuthService } from '@gnommostudios/ng-gnommo-base';
import { Fountain } from '../models/fountain.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class FountainService extends BaseService<Fountain> {
        constructor(http: HttpClient,
                private authService: AuthService) {
                super(http,
                        environment.apiUrl,
                        'fountains');
        }


        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getByLocation(headers?: any): Observable<[Fountain]> {
                return this.http.get(`${this.url}/${this.endpoint}-location`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getMetrics(headers?: any): Observable<[Fountain]> {
                return this.http.get(`${this.url}/${this.endpoint}-metrics`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getCSV(headers?: any): Observable<[Fountain]> {
                return this.http.get(`${this.url}/${this.endpoint}-export-csv`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getSimpleCSV(headers?: any): Observable<[Fountain]> {
                return this.http.get(`${this.url}/${this.endpoint}-export-simple-csv`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public createWithCSV(formData, corporateId): Observable<any> {
                const httpOptions = {
                        headers: new HttpHeaders({
                                'Authorization': `Bearer ${this.authService.getToken().id}`,
                                'Accept': 'application/json',
                                'Accept-language': 'es',
                                'corporateId': corporateId
                        })
                };

                return this.http.post(`${this.url}/${this.endpoint}-create-csv`, formData, httpOptions)
                        .pipe(
                                map((data: any) => data));
        }
}
