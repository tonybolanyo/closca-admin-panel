import { Routes, RouterModule } from "@angular/router";
import { SponsoredFountainsComponent } from "./containers/sponsored-fountains/sponsored-fountains.component";
import { SponsoredFountainsListComponent } from "./components/sponsored-fountains-list/sponsored-fountains-list.component";
import { SponsoredFountainDetailComponent } from "./components/sponsored-fountain-detail/sponsored-fountain-detail.component";
import { CanDeactivateGuard } from "src/app/shared/guards/can-deactivate.guard";
import { NgModule } from "@angular/core";
import { SponsoredFountainCreateComponent } from "./components/sponsored-fountain-create/sponsored-fountain-create.component";

const routes: Routes = [
    {
        path: '',
        component: SponsoredFountainsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', component: SponsoredFountainsListComponent },
            {
                path: 'new',
                component: SponsoredFountainCreateComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: SponsoredFountainDetailComponent,
            },
            {
                path: 'edit/:id',
                component: SponsoredFountainDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SponsoredFountainsRoutingModule {

}
