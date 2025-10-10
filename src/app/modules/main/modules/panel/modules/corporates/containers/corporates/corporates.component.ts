import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-corporates',
  templateUrl: './corporates.component.html',
  styleUrls: ['./corporates.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorporatesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
