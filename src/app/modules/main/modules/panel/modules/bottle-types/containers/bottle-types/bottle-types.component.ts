import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-bottle-types',
  templateUrl: './bottle-types.component.html',
  styleUrls: ['./bottle-types.component.scss'],
  imports: [RouterOutlet]
})
export class BottleTypesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
