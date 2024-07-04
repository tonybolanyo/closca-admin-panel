import { Injectable } from '@angular/core';
import { BaseService, AuthService } from '@gnommostudios/ng-gnommo-base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Challenge } from '../models';

@Injectable()

export class ChallengeService extends BaseService<Challenge> {
    constructor(http: HttpClient,
        private authService: AuthService) {
        super(http,
            environment.apiUrl,
            'challenge');
    }

    public updateOrder(values: any, headers?: any): Observable<any> {
        return this.http.patch(`${this.url}/${this.endpoint}-update-order`, values, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public pause(challengeId?: any, headers?: any): Observable<any> {
        return this.http.patch(`${this.url}/${this.endpoint}-pause/${challengeId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public createMultipart(formData): Observable<any> {
        /* Custom httpOptions used to upload transport
        documentation with multipart/form-data header */
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken().id}`,
                'Accept': 'application/json',
                'Accept-language': 'es'
            })
        };

        return this.http.post(`${this.url}/${this.endpoint}`, formData, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public updateMultipart(challendeId: string, formData, csvMode: string): Observable<any> {
        /* Custom httpOptions used to upload transport
        documentation with multipart/form-data header */
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken().id}`,
                'Accept': 'application/json',
                'Accept-language': 'es',
                'csvMode': csvMode
            })
        };

        return this.http.patch(`${this.url}/${this.endpoint}/${challendeId}/update-with-csv`, formData, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public getUsersTarget(challengeId, headers?: any): Observable<[any]> {
        return this.http.get(`${this.url}/${this.endpoint}/${challengeId}/users-target-csv`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public getMetrics(challengeId, headers?: any): Observable<[any]> {
        return this.http.get(`${this.url}/${this.endpoint}-metrics/${challengeId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public getRanking(challengeId, headers?: any): Observable<[any]> {
        return this.http.get(`${this.url}/${this.endpoint}-ranking/${challengeId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
