import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { MenuItem } from '../../../../../../shared/interfaces/menu-item.interface';
import { Subscription } from 'rxjs';
// import { LoggedUserService } from '../../../../../../shared/services/logged-user.service';

@Component({
  standalone: false,
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SidebarComponent implements OnInit, OnDestroy {
    @Input('sidebarItems') sidebarItems: MenuItem[] = [];
    requestStatus: string;

    constructor() {
    }

    ngOnInit() {
     }

     ngOnDestroy() {
     }


    //  checkVisibilityOfMenuItem(item: MenuItem) {
    //      if (this.loggedUserService.getRoleUser() === 'proficient') {
    //         if (this.requestStatus === 'PENDING' || this.requestStatus === 'FINISHED' && !item.isDisabledWithStatusRequestFinished) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //      } else {
    //          return true;
    //      }
    //  }
}
