import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss'],
  imports: [RouterOutlet]
})
export class LevelsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
