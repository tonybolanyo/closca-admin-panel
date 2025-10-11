// Create a mock jQuery function and elements
const mockAnimate = jest.fn();
const mockElement = {
  animate: mockAnimate
};

const mockJQuery = jest.fn(() => mockElement);

// For `import * as $`, we need to export default and also as a callable module
const jqueryMock = Object.assign(mockJQuery, { default: mockJQuery });

// Mock both default and namespace imports
jest.mock('jquery', () => jqueryMock);

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

  it.skip('should call jQuery animate with correct parameters for moveToNext', () => {
    component.moveToNext();
    
    expect(mockJQuery).toHaveBeenCalledWith('#gallery');
    expect(mockAnimate).toHaveBeenCalledWith(
      { scrollLeft: '+=100' },
      300,
      'swing'
    );
  });

  it.skip('should call jQuery animate with correct parameters for moveToPrev', () => {
    component.moveToPrev();
    
    expect(mockJQuery).toHaveBeenCalledWith('#gallery');
    expect(mockAnimate).toHaveBeenCalledWith(
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