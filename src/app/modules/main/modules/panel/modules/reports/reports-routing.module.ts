import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './containers/reports/reports.component';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'prefix'
            },
            {
                path: 'list',
                component: ReportsListComponent
            },
            {
                path: 'view/:id',
                component: ReportDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            },
            {
                path: 'edit/:id',
                component: ReportDetailComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule {

}
