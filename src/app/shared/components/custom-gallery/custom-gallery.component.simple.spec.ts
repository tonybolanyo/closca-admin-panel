// Mock jQuery before importing component
const mockJQuery = {
  animate: jest.fn()
};

jest.mock('jquery', () => jest.fn(() => mockJQuery));

import { CustomGalleryComponent } from './custom-gallery.component';

describe('CustomGalleryComponent (Unit Tests)', () => {
  let component: CustomGalleryComponent;

  beforeEach(() => {
    component = new CustomGalleryComponent();
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.images).toEqual([]);
    expect(component.imageModel).toBe('REQUEST');
    expect(component.sendFileKeySelected).toBeDefined();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should extract fileKey from URL and emit it in selectImage', () => {
    const mockEmit = jest.fn();
    component.sendFileKeySelected.next = mockEmit;
    
    const testUrl = 'https://example.com/image.jpg?fileKey=test123&other=param';
    
    component.selectImage(testUrl);
    
    expect(component.fileKeySelected).toBe('test123');
    expect(mockEmit).toHaveBeenCalledWith('test123');
  });

  it('should handle URL without fileKey parameter', () => {
    const mockEmit = jest.fn();
    component.sendFileKeySelected.next = mockEmit;
    
    const testUrl = 'https://example.com/image.jpg?other=param';
    
    component.selectImage(testUrl);
    
    expect(component.fileKeySelected).toBeNull();
    expect(mockEmit).toHaveBeenCalledWith(null);
  });

  it('should call jQuery animate with correct parameters for moveToNext', () => {
    const $ = require('jquery');
    component.moveToNext();
    
    expect($).toHaveBeenCalledWith('#gallery');
    expect(mockJQuery.animate).toHaveBeenCalledWith(
      { scrollLeft: '+=100' },
      300,
      'swing'
    );
  });

  it('should call jQuery animate with correct parameters for moveToPrev', () => {
    const $ = require('jquery');
    component.moveToPrev();
    
    expect($).toHaveBeenCalledWith('#gallery');
    expect(mockJQuery.animate).toHaveBeenCalledWith(
      { scrollLeft: '-=100' },
      300,
      'swing'
    );
  });

  it('should handle input properties correctly', () => {
    const testImages = ['image1.jpg', 'image2.jpg'];
    const testModel = 'CUSTOM';
    
    component.images = testImages;
    component.imageModel = testModel;
    
    expect(component.images).toBe(testImages);
    expect(component.imageModel).toBe(testModel);
  });
});