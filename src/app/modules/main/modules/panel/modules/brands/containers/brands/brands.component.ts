import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  imports: [RouterOutlet]
})
export class BrandsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
