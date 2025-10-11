import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  imports: [RouterOutlet]
})
export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
