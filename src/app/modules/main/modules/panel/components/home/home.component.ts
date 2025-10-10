import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  standalone: false,
    selector: 'app-home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    user;
    role;
    constructor(private loggedUserService: LoggedUserService) { }

    ngOnInit() {
        this.role = this.loggedUserService.getRole()
        this.user = this.loggedUserService.getLoggedUserValue();
    }
}
