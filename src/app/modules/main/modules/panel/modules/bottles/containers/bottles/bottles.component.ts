import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-bottles',
  templateUrl: './bottles.component.html',
  styleUrls: ['./bottles.component.scss'],
  imports: [RouterOutlet]
})
export class BottlesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
