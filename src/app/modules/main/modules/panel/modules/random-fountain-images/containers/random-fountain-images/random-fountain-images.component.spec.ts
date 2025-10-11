import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of, throwError } from 'rxjs';

import { RandomFountainImagesComponent } from './random-fountain-images.component';
import { ImagesRandomService } from 'src/app/shared/custom-gnommo-base/services';

describe('RandomFountainImagesComponent', () => {
  let component: RandomFountainImagesComponent;
  let fixture: ComponentFixture<RandomFountainImagesComponent>;
  let mockImagesRandomService: any;
  let mockDialog: any;
  let mockModalService: any;
  let mockToastrService: any;
  let mockNgxLoader: any;

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

    mockModalService = {
      open: jest.fn()
    };

    mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };

    mockNgxLoader = {
      start: jest.fn(),
      stop: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ RandomFountainImagesComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ImagesRandomService, useValue: mockImagesRandomService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgbModal, useValue: mockModalService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: NgxUiLoaderService, useValue: mockNgxLoader }
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
    expect(mockNgxLoader.start).toHaveBeenCalled();
  });

  it('should handle getImages error', () => {
    mockImagesRandomService.getAll.mockReturnValue(throwError({ error: 'Test error' }));
    component.getImages();
    expect(mockNgxLoader.stop).toHaveBeenCalled();
  });

  it('should call assignToFountains successfully', () => {
    component.assignImages();
    expect(mockImagesRandomService.assignToFountains).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith(
      'Se han asignado las imágenes a las fuentes',
      'Listo'
    );
  });

  it('should handle assignToFountains error', () => {
    mockImagesRandomService.assignToFountains.mockReturnValue(throwError({ error: 'Test error' }));
    component.assignImages();
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Ha ocurrido un error al asignar las imágenes a las fuentes',
      'Error'
    );
  });

  it('should open dialog when deleting image', () => {
    component.deleteImage('test-id');
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should delete image when dialog is confirmed', () => {
    component.deleteImage('test-id');
    expect(mockImagesRandomService.deleteImages).toHaveBeenCalledWith('test-id');
  });

  it('should not delete image when dialog is cancelled', () => {
    mockDialog.open.mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(false))
    });
    mockImagesRandomService.deleteImages.mockClear();
    component.deleteImage('test-id');
    expect(mockImagesRandomService.deleteImages).not.toHaveBeenCalled();
  });

  it('should handle deleteImages error', () => {
    mockImagesRandomService.deleteImages.mockReturnValue(throwError({ error: 'Test error' }));
    component.deleteImage('test-id');
    expect(mockNgxLoader.stop).toHaveBeenCalled();
  });

  it('should have getImage method that returns S3 URL', () => {
    const fileKey = 'test-image.jpg';
    const result = component.getImage(fileKey);
    expect(result).toContain(fileKey);
  });

  it('should show image modal', () => {
    const mockContent = 'test-content';
    const mockImage = { url: 'test.jpg' };
    component.showImage(mockContent, mockImage);
    expect(component.imageToShow).toEqual(mockImage);
    expect(mockModalService.open).toHaveBeenCalledWith(
      mockContent,
      expect.objectContaining({
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true
      })
    );
  });

  it('should configure uploader onAfterAddingFile handler', () => {
    component.handlerUploaders();
    expect(component.uploader.onAfterAddingFile).toBeDefined();
  });
});
