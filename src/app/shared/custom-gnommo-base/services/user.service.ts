import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, LoginBaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models';


@Injectable()
export class UserService extends LoginBaseService<User> {
        constructor(http: HttpClient,
                private authService: AuthService) {
                super(http,
                        environment.apiUrl,
                        'users');
        }

        public deleteAvatarImage(userId: string, headers?: any): Observable<any> {
                return this.http.delete(`${this.url}/${this.endpoint}/avatar/${userId}`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getMetrics(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-metrics`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getCSV(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-export-csv`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public getMetricsTotal(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-metrics-total`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public invitateCorporateWithCSV(formData, corporateId): Observable<any> {
                const httpOptions = {
                        headers: new HttpHeaders({
                                'Authorization': `Bearer ${this.authService.getToken().id}`,
                                'Accept': 'application/json',
                                'Accept-language': 'es',
                                'corporateId': corporateId
                        })
                };

                return this.http.post(`${this.url}/${this.endpoint}-invitate-corporate`, formData, httpOptions)
                        .pipe(
                                map((data: any) => data));
        }
}
