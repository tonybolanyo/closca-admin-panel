import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRateComponent } from './containers/user-rate/user-rate.component';
import { UserRateListComponent } from './components/user-rate-list/user-rate-list.component';
import { UserRateDetailComponent } from './components/user-rate-detail/user-rate-detail.component';
import { UserRateRoutingModule } from './user-rate-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
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
  ]
})
export class UserRateModule { }
