import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';

import { RandomFountainImagesComponent } from './random-fountain-images.component';
import { ImagesRandomService } from 'src/app/shared/custom-gnommo-base/services';

describe('RandomFountainImagesComponent', () => {
  let component: RandomFountainImagesComponent;
  let fixture: ComponentFixture<RandomFountainImagesComponent>;
  let mockImagesRandomService: any;
  let mockDialog: any;

  beforeEach(waitForAsync(() => {
    mockImagesRandomService = {
      getAll: jest.fn().mockReturnValue(of([])),
      uploadImages: jest.fn().mockReturnValue(of({})),
      deleteImages: jest.fn().mockReturnValue(of({})),
      assignToFountains: jest.fn().mockReturnValue(of({}))
    };

    mockDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    };

    const mockModalService = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ RandomFountainImagesComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ImagesRandomService, useValue: mockImagesRandomService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgbModal, useValue: mockModalService },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: NgxUiLoaderService, useValue: { start: jest.fn(), stop: jest.fn() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomFountainImagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty images array', () => {
    expect(component.images).toEqual([]);
  });

  it('should have uploader configured', () => {
    expect(component.uploader).toBeDefined();
    expect(component.uploader.options.allowedMimeType).toEqual(['image/png', 'image/jpg', 'image/jpeg']);
  });

  it('should call getImages on init', () => {
    const getImagesSpy = jest.spyOn(component, 'getImages');
    component.ngOnInit();
    expect(getImagesSpy).toHaveBeenCalled();
  });

  it('should call handlerUploaders on init', () => {
    const handlerUploadersSpy = jest.spyOn(component, 'handlerUploaders');
    component.ngOnInit();
    expect(handlerUploadersSpy).toHaveBeenCalled();
  });

  it('should get images from service', () => {
    component.getImages();
    expect(mockImagesRandomService.getAll).toHaveBeenCalled();
  });

  it('should call assignToFountains', () => {
    component.assignImages();
    expect(mockImagesRandomService.assignToFountains).toHaveBeenCalled();
  });

  it('should open dialog when deleting image', () => {
    component.deleteImage('test-id');
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should have getImage method that returns S3 URL', () => {
    const fileKey = 'test-image.jpg';
    const result = component.getImage(fileKey);
    expect(result).toContain(fileKey);
  });
});
