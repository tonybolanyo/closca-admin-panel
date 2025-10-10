import { Component, OnInit, ViewEncapsulation, Renderer2, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { MenuItem } from '../../../../shared/interfaces/menu-item.interface';
import { MENU_ITEMS, ADMIN_MENU_ITEMS, PROVIDER_MENU_ITEMS, USER_MENU_ITEMS, MANAGER_MENU_ITEMS } from '../../../../shared/constants/menu-items';
import { Router } from '@angular/router';
import { LoggedUserService } from '../../../../shared/services/logged-user.service';
import { ROUTER_DEFINITIONS } from '../../../../shared/constants/router-definitions';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { S3_URL } from 'src/app/shared/constants/constants';

@Component({
  standalone: false,
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnInit {
    isNavbarCollapsed = true;
    menuItems: MenuItem[];
    urlRoute: string;
    urlChildRoute: string;
    innerWidth = window.innerWidth;
    @ViewChild('overlay') public overlay: ElementRef;
    isNavigateToOtherComponent = false;
    isRouteStart = false;
    routerDefinitions = ROUTER_DEFINITIONS;
    requestStatus: string;

    corporate;

    role;
    corporateId;
    constructor(
        private renderer2: Renderer2,
        private router: Router,
        private corporateService: CorporateService,
        private loggedUserService: LoggedUserService
    ) {
        this.role = this.loggedUserService.getRole();
        this.corporateId = this.loggedUserService.getCorporateId();
        this.responsiveNavbarHandler();
    }

    ngOnInit() {
        switch (this.role) {
            case 'ADMIN':
                this.menuItems = ADMIN_MENU_ITEMS;
                document.documentElement.style.removeProperty(`--corporate-primary`);
                break;
            case 'MANAGER':
                this.menuItems = MANAGER_MENU_ITEMS;
                this.corporateService
                    .getById(this.corporateId)
                    .subscribe(
                        (corporate: any) => {
                            this.corporate = corporate;
                            
                            document.documentElement.style.setProperty(`--corporate-primary`, this.corporate.color);
                        }
                    );
                break;
            case 'PROVIDER':
                this.menuItems = PROVIDER_MENU_ITEMS;
                break;
            case 'USER':
                this.menuItems = USER_MENU_ITEMS;
                break;
            default:
                this.menuItems = MENU_ITEMS;
                break;
        }
    }


    responsiveNavbarHandler() {
        // this.router.events.subscribe((event: Event) => {
        //     let urlRouteEnd: string;
        //     // Check is page is reload
        //     if (event instanceof NavigationStart) {
        //         this.isRouteStart = true;
        //     }
        //     if (event instanceof NavigationEnd) {
        //         urlRouteEnd = event.url;
        //         this.urlRoute = urlRouteEnd.split('/')[1];
        //         this.urlChildRoute = urlRouteEnd.split('/')[2];
        //     }
        // });
    }

    menuItemChangeCollapseState(routeToNavigate: string) {
        this.isNavbarCollapsed = true;
        if (!this.isNavbarCollapsed) {
            this.renderer2.setStyle(this.overlay.nativeElement, 'display', 'block');
        } else {
            this.renderer2.setStyle(this.overlay.nativeElement, 'display', 'none');
        }
    }
    changeCollapseState() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
        if (!this.isNavbarCollapsed) {
            this.renderer2.setStyle(this.overlay.nativeElement, 'display', 'block');
        } else {
            this.renderer2.setStyle(this.overlay.nativeElement, 'display', 'none');
        }
    }

    // showResponsiveNavbarItems(): boolean {
    //     let showResponsiveItems = false;
    //     if (this.urlRoute === 'panel') {
    //         showResponsiveItems = true;
    //     }
    //     if (this.urlRoute === 'workers' && this.urlChildRoute === 'panel') {
    //         showResponsiveItems = true;
    //     }

    //     return showResponsiveItems;
    // }

    onLogout() {
        this.router.navigate([this.routerDefinitions.login]);
        this.loggedUserService.logout();
    }



    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.innerWidth = window.innerWidth;
    }

    getImage(fileKey): string {
        return S3_URL + fileKey;
    }


}
