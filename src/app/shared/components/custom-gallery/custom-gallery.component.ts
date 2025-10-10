import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as $ from 'jquery';
import * as jQuery from 'jquery';

@Component({
  standalone: false,
    selector: 'app-custom-gallery',
    templateUrl: 'custom-gallery.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./custom-gallery.component.scss']
})

export class CustomGalleryComponent implements OnInit {
    @Input('images') images = [];
    @Input('imageModel') imageModel = 'REQUEST';
    @Output('sendFileKeySelected') sendFileKeySelected: EventEmitter<any> = new EventEmitter();
    fileKeySelected: string;

    constructor() { }

    ngOnInit() { }

    selectImage(url) {
        const urlImage = new URL(url);
        this.fileKeySelected = urlImage.searchParams.get('fileKey');
        this.sendFileKeySelected.next(this.fileKeySelected);
    }
    moveToNext() {
        $('#gallery').animate({ scrollLeft: '+=100' }, 300, 'swing');
    }
    moveToPrev() {
        $('#gallery').animate({ scrollLeft: '-=100' }, 300, 'swing');
    }


    // type of image!
    // getImage(fileKey) {
    //     const encodeFileKey = encodeURIComponent(fileKey);
    //     // let endpointRequest;
    //     // switch (this.imageModel) {
    //     //     case 'REQUEST':
    //     //         // tslint:disable-next-line:max-line-length
    //     //         endpointRequest = `${environment.apiUrl}/api/requests/get-file-images?fileKey=${encodeFileKey}&access_token=${this.loopBackAuth.getAccessTokenId()}`;
    //     //         break;
    //     //     case 'PERITATION':
    //     //         // tslint:disable-next-line:max-line-length
    //     //         endpointRequest = `${environment.apiUrl}/api/peritations/get-file-images?fileKey=${encodeFileKey}&access_token=${this.loopBackAuth.getAccessTokenId()}`;
    //     //         break;
    //     //     default:
    //     //         // tslint:disable-next-line:max-line-length
    //     //         endpointRequest = `${environment.apiUrl}/api/peritations/get-file-images?fileKey=${encodeFileKey}&access_token=${this.loopBackAuth.getAccessTokenId()}`;
    //     //         break;
    //     }
    //     // return endpointRequest;



    // }
}
