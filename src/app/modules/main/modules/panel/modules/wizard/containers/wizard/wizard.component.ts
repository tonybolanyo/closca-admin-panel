import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  imports: [RouterOutlet]
})
export class WizardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
