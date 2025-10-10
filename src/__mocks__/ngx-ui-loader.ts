export class NgxUiLoaderService {
  start() {}
  stop() {}
  startLoader() {}
  stopLoader() {}
  startBackground() {}
  stopBackground() {}
}

export class NgxUiLoaderModule {
  static forRoot() {
    return { ngModule: NgxUiLoaderModule, providers: [] };
  }
}

export const SPINNER = {
  ballScaleMultiple: 'ball-scale-multiple',
  ballSpin: 'ball-spin',
  ballSpinClockwise: 'ball-spin-clockwise',
};

export const POSITION = {
  bottomCenter: 'bottom-center',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
  centerCenter: 'center-center',
  centerLeft: 'center-left',
  centerRight: 'center-right',
  topCenter: 'top-center',
  topLeft: 'top-left',
  topRight: 'top-right',
};

export const PB_DIRECTION = {
  leftToRight: 'ltr',
  rightToLeft: 'rtl',
};
