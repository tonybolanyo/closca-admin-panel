import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, BaseService } from '@tyris/angular-foundation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ImagesRandomService extends BaseService<any> {
    constructor(
        http: HttpClient,
        private authService: AuthService
    ) {
        super(http,
            environment.apiUrl,
            'images-random');
    }
    public uploadImages(formData, headers?: any): Observable<any> {
        /* Custom httpOptions used to upload  with multipart/form-data header */
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

    public deleteImages(imageId: string, headers?: any): Observable<any> {
        return this.http.delete(`${this.url}/${this.endpoint}/${imageId}`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }

    public assignToFountains(headers?: any): Observable<any> {
        return this.http.get(`${this.url}/fountains-random-images`, this.createHttpHeaders(headers))
            .pipe(
                map((data: any) => data));
    }
}
