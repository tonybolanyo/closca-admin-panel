import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Mock Google Maps API
(global as any).google = {
  maps: {
    Map: jest.fn(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      fitBounds: jest.fn(),
      panToBounds: jest.fn(),
      addListener: jest.fn(),
    })),
    Marker: jest.fn(() => ({
      setMap: jest.fn(),
      addListener: jest.fn(),
    })),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    LatLngBounds: jest.fn(() => ({
      extend: jest.fn(),
    })),
    Size: jest.fn((width, height) => ({ width, height })),
    Point: jest.fn((x, y) => ({ x, y })),
    InfoWindow: jest.fn(() => ({
      open: jest.fn(),
      close: jest.fn(),
      setContent: jest.fn(),
    })),
    event: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      clearInstanceListeners: jest.fn(),
    },
    places: {
      AutocompleteService: jest.fn(),
      PlacesService: jest.fn(),
    },
  },
};

// Mock commonly used browser APIs
Object.defineProperty(window, 'CSS', {value: null});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});