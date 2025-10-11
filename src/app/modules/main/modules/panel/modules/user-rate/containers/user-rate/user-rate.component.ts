import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-rate',
  templateUrl: './user-rate.component.html',
  styleUrls: ['./user-rate.component.scss'],
  imports: [RouterOutlet]
})
export class UserRateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
