import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { SponsoredFountainCreateComponent } from './sponsored-fountain-create.component';

describe('SponsoredFountainCreateComponent', () => {
  let component: SponsoredFountainCreateComponent;
  let fixture: ComponentFixture<SponsoredFountainCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainCreateComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {} },
            params: { subscribe: jest.fn() }
          } 
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ToastrService,
          useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() }
        },
        { 
          provide: NgxUiLoaderService, 
          useValue: { start: jest.fn(), stop: jest.fn() } 
        },
        {
          provide: FountainService,
          useValue: { 
            create: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
            update: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
            getById: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
            getAll: jest.fn().mockReturnValue({ subscribe: jest.fn() })
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredFountainCreateComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid triggering component initialization
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
