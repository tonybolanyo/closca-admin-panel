import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MENU_ITEMS, ADMIN_MENU_ITEMS, PROVIDER_MENU_ITEMS, USER_MENU_ITEMS, MANAGER_MENU_ITEMS } from '../../../../../../shared/constants/menu-items';
import { MenuItem } from '../../../../../../shared/interfaces/menu-item.interface';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  standalone: false,
    selector: 'app-panel',
    templateUrl: 'panel.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./panel.component.scss']
})

export class PanelComponent implements OnInit {
    sidebarItems: MenuItem[] = [];
    role;
    constructor(private loggedUserService: LoggedUserService) {
        this.role = this.loggedUserService.getRole();
    }

    ngOnInit() {
        switch (this.role) {
            case 'ADMIN':
                this.sidebarItems = ADMIN_MENU_ITEMS;
                break;
            case 'MANAGER':
                this.sidebarItems = MANAGER_MENU_ITEMS;
                break;
            case 'PROVIDER':
                this.sidebarItems = PROVIDER_MENU_ITEMS;
                break;
            case 'USER':
                this.sidebarItems = USER_MENU_ITEMS;
                break;
            default:
                this.sidebarItems = MENU_ITEMS;
                break;
        }
    }
}
