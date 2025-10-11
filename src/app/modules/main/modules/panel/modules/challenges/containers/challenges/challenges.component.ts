import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-challenges',
  templateUrl: 'challenges.component.html',
  imports: [RouterOutlet]
})

export class ChallengesComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
