import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryService } from '@ks89/angular-modal-gallery';

import { ExampleCrudDetailComponent } from './example-crud-detail.component';

describe('ExampleCrudDetailComponent', () => {
  let component: ExampleCrudDetailComponent;
  let fixture: ComponentFixture<ExampleCrudDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCrudDetailComponent ],
      imports: [ ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {}, url: [{ path: 'create' }] }
          } 
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        { provide: GalleryService, useValue: { openGallery: jest.fn(), closeGallery: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: DateAdapter, useValue: { setLocale: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCrudDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
