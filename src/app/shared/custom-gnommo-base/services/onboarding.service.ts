import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Onboarding } from '../models/onboarding.model';

@Injectable()
export class OnboardingService extends BaseService<Onboarding> {

        constructor(http: HttpClient) {
                super(http,
                        environment.apiUrl,
                        'onboardings');
        }

        public updateOnboarding(onboardingId?: string, values?: any, headers?: any): Observable<any> {
                return this.http.patch(`${this.url}/${this.endpoint}/${onboardingId}`, values, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }

        public count(headers?: any): Observable<any> {
                return this.http.get(`${this.url}/${this.endpoint}-count`, this.createHttpHeaders(headers))
                        .pipe(
                                map((data: any) => data));
        }
}
