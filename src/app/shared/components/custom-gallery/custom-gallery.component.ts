import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import * as $ from 'jquery';
import * as jQuery from 'jquery';

@Component({
  standalone: true,
    selector: 'app-custom-gallery',
    templateUrl: 'custom-gallery.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./custom-gallery.component.scss'],
    imports: [CommonModule]
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

    getImage(key: string) {
        // Placeholder - implement based on imageModel
        return `${environment.apiUrl}/images/${key}`;
    }
}
