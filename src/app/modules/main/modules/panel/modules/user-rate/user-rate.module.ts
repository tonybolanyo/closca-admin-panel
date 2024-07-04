import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRateComponent } from './containers/user-rate/user-rate.component';
import { UserRateListComponent } from './components/user-rate-list/user-rate-list.component';
import { UserRateDetailComponent } from './components/user-rate-detail/user-rate-detail.component';
import { UserRateRoutingModule } from './user-rate-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule,
  MatPaginatorModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    NgbRatingModule,
    SharedModule,
    UserRateRoutingModule
  ],
  declarations: [
    UserRateComponent,
    UserRateListComponent,
    UserRateDetailComponent
  ]
})
export class UserRateModule { }
