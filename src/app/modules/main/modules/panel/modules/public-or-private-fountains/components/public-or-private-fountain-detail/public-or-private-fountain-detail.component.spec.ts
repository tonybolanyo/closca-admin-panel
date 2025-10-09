import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } }, ReactiveFormsModule } from '@angular/forms';

import { PublicOrPrivateFountainDetailComponent } from './public-or-private-fountain-detail.component';

describe('FountainDetailComponent', () => {
  let component: PublicOrPrivateFountainDetailComponent;
  let fixture: ComponentFixture<PublicOrPrivateFountainDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOrPrivateFountainDetailComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {} },
            params: { subscribe: jest.fn() }
          } 
        }
      ]
    })
    .overrideComponent(PublicOrPrivateFountainDetailComponent, {
      set: {
        templateUrl: undefined,
        template: '<div></div>',
        styleUrls: []
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOrPrivateFountainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
