import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
