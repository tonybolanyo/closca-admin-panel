import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-public-or-private-fountains',
  templateUrl: './public-or-private-fountains.component.html',
  styleUrls: ['./public-or-private-fountains.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet]
})
export class PublicOrPrivateFountainsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
