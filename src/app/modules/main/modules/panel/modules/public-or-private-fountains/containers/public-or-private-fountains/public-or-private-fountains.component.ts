import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-public-or-private-fountains',
  templateUrl: './public-or-private-fountains.component.html',
  styleUrls: ['./public-or-private-fountains.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublicOrPrivateFountainsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
