import { Injectable } from '@angular/core';
import { BaseService } from '@tyris/angular-foundation-libs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RewardService extends BaseService<any> {
    constructor(http: HttpClient) {
        super(http,
            environment.apiUrl,
            'rewards');
    }

    public getRewardByProduct(productId: string, headers?: any): Observable<any> {
        return this.http.get(`${this.url}/${this.endpoint}-all/${productId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}