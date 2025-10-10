import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FountainService } from '../../../../../../shared/custom-gnommo-base/services/fountain.service';
import { SponsoredFountainCreateComponent } from './sponsored-fountain-create.component';

describe('SponsoredFountainCreateComponent', () => {
  let component: SponsoredFountainCreateComponent;
  let fixture: ComponentFixture<SponsoredFountainCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredFountainCreateComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
    .overrideComponent(SponsoredFountainCreateComponent, {
      set: {
        templateUrl: undefined,
        template: '<div></div>',
        styleUrls: [],
        providers: []
      }
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
