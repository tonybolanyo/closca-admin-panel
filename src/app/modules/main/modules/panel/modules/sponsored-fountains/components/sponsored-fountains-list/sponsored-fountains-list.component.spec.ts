import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { SponsoredFountainsListComponent } from './sponsored-fountains-list.component';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

describe('SponsoredFountainsListComponent', () => {
  let component: SponsoredFountainsListComponent;
  let fixture: ComponentFixture<SponsoredFountainsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainsListComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } },
        { provide: FountainService, useValue: { getAll: jest.fn().mockReturnValue(of({})), count: jest.fn().mockReturnValue(of({})) } },
        { provide: CorporateService, useValue: { getAll: jest.fn().mockReturnValue(of({})) } },
        { provide: LoggedUserService, useValue: { getRole: jest.fn().mockReturnValue('ADMIN'), getCorporateId: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainsListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
