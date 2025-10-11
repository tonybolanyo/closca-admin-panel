import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sponsored-fountains',
  templateUrl: './sponsored-fountains.component.html',
  styleUrls: ['./sponsored-fountains.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet]
})
export class SponsoredFountainsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
