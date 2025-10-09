import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } }, ReactiveFormsModule } from '@angular/forms';

import { BottleTypeDetailComponent } from './bottle-type-detail.component';

describe('BottleTypeDetailComponent', () => {
  let component: BottleTypeDetailComponent;
  let fixture: ComponentFixture<BottleTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleTypeDetailComponent ],
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
    .overrideComponent(BottleTypeDetailComponent, {
      set: {
        templateUrl: undefined,
        template: '<div></div>',
        styleUrls: []
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
