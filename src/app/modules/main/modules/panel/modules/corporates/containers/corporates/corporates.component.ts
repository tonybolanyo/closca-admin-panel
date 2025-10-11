import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-corporates',
  templateUrl: './corporates.component.html',
  styleUrls: ['./corporates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet]
})
export class CorporatesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
