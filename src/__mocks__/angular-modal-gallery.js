// Mock for @ks89/angular-modal-gallery
class Image {
  constructor() {}
}

class PlainGalleryConfig {
  constructor() {}
}

class PlainGalleryStrategy {
  static ROW = 1;
  static COLUMN = 2;
  static GRID = 3;
  static CUSTOM = 4;
}

class LineLayout {
  constructor() {}
}

class Description {
  constructor() {}
}

class DescriptionStrategy {
  static ALWAYS_HIDDEN = 1;
  static ALWAYS_VISIBLE = 2;
  static HIDE_IF_EMPTY = 3;
}

class GalleryService {
  constructor() {}
  openGallery() {}
  closeGallery() {}
  updateGallery() {}
  addImage() {}
}

class ModalGalleryService {
  constructor() {}
}

class GalleryModule {
  static forRoot() {
    return {
      ngModule: GalleryModule,
      providers: []
    };
  }
}

module.exports = {
  GalleryModule,
  ModalGalleryService,
  GalleryService,
  Image,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  LineLayout,
  Description,
  DescriptionStrategy
};
