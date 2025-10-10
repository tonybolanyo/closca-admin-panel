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
        loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users-impact',
        loadChildren: () => import('./modules/users-impact/users-impact.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'levels',
        loadChildren: () => import('./modules/levels/levels.module').then(m => m.LevelsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'corporates',
        loadChildren: () => import('./modules/corporates/corporates.module').then(m => m.CorporatesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'fountains-impact',
        loadChildren: () => import('./modules/fountains-impact/fountains-impact.module').then(m => m.FountainsImpactModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'public-or-private-fountains',
        loadChildren: () => import('./modules/public-or-private-fountains/public-or-private-fountains.module').then(m => m.PublicOrPrivateFountainsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sponsored-fountains',
        loadChildren: () => import('./modules/sponsored-fountains/sponsored-fountains.module').then(m => m.SponsoredFountainsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bottles',
        loadChildren: () => import('./modules/bottles/bottles.module').then(m => m.BottlesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bottle-types',
        loadChildren: () => import('./modules/bottle-types/bottle-types.module').then(m => m.BottleTypesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'brands',
        loadChildren: () => import('./modules/brands/brands.module').then(m => m.BrandsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'challenges',
        loadChildren: () => import('./modules/challenges/challenges.module').then(m => m.ChallengesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-types',
        loadChildren: () => import('./modules/product-types/product-types.module').then(m => m.ProductTypesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'wizard',
        loadChildren: () => import('./modules/wizard/wizard.module').then(m => m.WizardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-rate',
        loadChildren: () => import('./modules/user-rate/user-rate.module').then(m => m.UserRateModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'random-fountain-images',
        loadChildren: () => import('./modules/random-fountain-images/random-fountain-images.module').then(m => m.RandomFountainImagesModule),
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
