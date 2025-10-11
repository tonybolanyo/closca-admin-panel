import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-types',
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.scss'],
  imports: [RouterOutlet]
})
export class ProductTypesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
