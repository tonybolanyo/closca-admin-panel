import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';
import { LevelsComponent } from './containers/levels/levels.component';
import { LevelsListComponent } from './components/levels-list/levels-list.component';
import { LevelDetailComponent } from './components/level-detail/level-detail.component';

const routes: Routes = [
    {
        path: '',
        component: LevelsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', component: LevelsListComponent },
            {
                path: 'new',
                component: LevelDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'view/:id',
                component: LevelDetailComponent,
            }
            ,
            {
                path: 'edit/:id',
                component: LevelDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LevelsRoutingModule {

}
