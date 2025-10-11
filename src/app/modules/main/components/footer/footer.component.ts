import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: []
})

export class FooterComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
