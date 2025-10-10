import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';

@Component({
  standalone: false,
    selector: 'app-landing-page',
    templateUrl: 'landing-page.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit {
    peritationCompany;
    logo;
    routerDefinitions = ROUTER_DEFINITIONS;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.peritationCompany = this.activatedRoute.snapshot.params['peritationCompany'];

        switch (this.peritationCompany) {
            case 'axa':
            this.logo = '/assets/images/peritationCompaniesLogos/axa.png';
            break;
            case 'onper':
            this.logo = '/assets/images/logo.png';
            break;
            default:
            this.logo = '/assets/images/logo.png';
            break;
        }

    }

    ngOnInit() {

    }


    enterOnper() {
        this.router.navigate([this.routerDefinitions.login]);
    }


}
