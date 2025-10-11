import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-example-crud',
  templateUrl: './example-crud.component.html',
  styleUrls: ['./example-crud.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet]
})
export class ExampleCrudComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
