import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [RouterOutlet]
})
export class ProductsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
