import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  standalone: true,
    selector: 'app-home',
    templateUrl: 'home.component.html',
    imports: [CommonModule]
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
