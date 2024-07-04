import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// --> Components
import { PanelComponent } from './containers/panel/panel.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '../../../../shared/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: '', redirectTo: 'home',
        canActivate: [AuthGuard]
      },
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'users',
        loadChildren: './modules/users/users.module#UsersModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'users-impact',
        loadChildren: './modules/users-impact/users-impact.module#UsersModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'levels',
        loadChildren: './modules/levels/levels.module#LevelsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'corporates',
        loadChildren: './modules/corporates/corporates.module#CorporatesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'fountains-impact',
        loadChildren: './modules/fountains-impact/fountains-impact.module#FountainsImpactModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'public-or-private-fountains',
        loadChildren: './modules/public-or-private-fountains/public-or-private-fountains.module#PublicOrPrivateFountainsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'sponsored-fountains',
        loadChildren: './modules/sponsored-fountains/sponsored-fountains.module#SponsoredFountainsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'bottles',
        loadChildren: './modules/bottles/bottles.module#BottlesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'bottle-types',
        loadChildren: './modules/bottle-types/bottle-types.module#BottleTypesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'brands',
        loadChildren: './modules/brands/brands.module#BrandsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: './modules/reports/reports.module#ReportsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'challenges',
        loadChildren: './modules/challenges/challenges.module#ChallengesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: './modules/products/products.module#ProductsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'product-types',
        loadChildren: './modules/product-types/product-types.module#ProductTypesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'wizard',
        loadChildren: './modules/wizard/wizard.module#WizardModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'user-rate',
        loadChildren: './modules/user-rate/user-rate.module#UserRateModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'random-fountain-images',
        loadChildren: './modules/random-fountain-images/random-fountain-images.module#RandomFountainImagesModule',
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule {
}
