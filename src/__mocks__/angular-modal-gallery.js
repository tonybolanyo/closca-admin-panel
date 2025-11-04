// Mock for @ks89/angular-modal-gallery
module.exports = {
  GalleryModule: {
    forRoot: () => ({
      ngModule: 'GalleryModule',
      providers: []
    })
  },
  ModalGalleryService: jest.fn(),
  GalleryService: jest.fn()
};
