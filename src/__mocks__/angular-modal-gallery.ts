// Mock for @ks89/angular-modal-gallery
export class Image {
  constructor(public id: number = 0, public modal: any = {}, public plain: any = {}) {}
}

export class PlainGalleryConfig {
  constructor() {}
}

export class PlainGalleryStrategy {
  static ROW = 1;
  static COLUMN = 2;
  static GRID = 3;
  static CUSTOM = 4;
}

export class LineLayout {
  constructor() {}
}

export class Description {
  constructor() {}
}

export class DescriptionStrategy {
  static ALWAYS_HIDDEN = 1;
  static ALWAYS_VISIBLE = 2;
  static HIDE_IF_EMPTY = 3;
}

export class GalleryService {
  constructor() {}
  openGallery() {}
  closeGallery() {}
  updateGallery() {}
  addImage() {}
}

export class ModalGalleryService {
  constructor() {}
}

export class GalleryModule {
  static forRoot() {
    return {
      ngModule: GalleryModule,
      providers: []
    };
  }
}
