


import { Injectable } from '@angular/core';
import { BaseService, AuthService } from '@tyris/angular-foundation-libs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChallengeSubscription } from '../models';

@Injectable()

export class ChallengeSubscriptionService extends BaseService<ChallengeSubscription> {
    constructor(http: HttpClient,
        private authService: AuthService) {
        super(http,
            environment.apiUrl,
            'challenge-subscriptions');
    }

    public count(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public uploadSubscribeCSV(challendeId: string, formData, csvMode: string): Observable<any> {
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

        return this.http.post(`${this.url}/${this.endpoint}/${challendeId}/subscribe-by-csv`, formData, httpOptions)
            .pipe(
                map((data: any) => data));
    }

    public getUsersSubscribed(challengeId, headers?: any): Observable<[any]> {
        return this.http.get(`${this.url}/${this.endpoint}/${challengeId}/get-subscriptions-csv `, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }



}


