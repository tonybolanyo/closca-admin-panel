import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-fountains-impact',
  templateUrl: './fountains-impact.component.html',
  styleUrls: ['./fountains-impact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet]
})
export class FountainsImpactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
