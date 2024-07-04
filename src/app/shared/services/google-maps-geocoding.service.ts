import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class GoogleMapsGeocodingService {
    // apiAddressMapsUrl;
    // constructor(private httpClient: HttpClient) { }


    // getGeocode(address): Observable<any> {
    //     this.apiAddressMapsUrl =
    //         `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDwTjzdcj8E5s3Rdx90rSjkGLHPVIFoCG0`;
    //     return this.httpClient.get(this.apiAddressMapsUrl);
    // }
}
