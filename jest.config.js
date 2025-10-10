module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,ts}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,ts}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/test.ts'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '@tyris/angular-foundation': '<rootDir>/src/__mocks__/@tyris/angular-foundation.ts',
    '@ks89/angular-modal-gallery': '<rootDir>/src/__mocks__/angular-modal-gallery.ts',
    'ng-apexcharts': '<rootDir>/src/__mocks__/ng-apexcharts.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
    '!src/**/environment*.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/test.ts'
  ],
  coverageReporters: [
    'text',
    'lcov',
    'json-summary',
    'html'
  ],
  coverageDirectory: 'coverage',
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ngrx|ngx-bootstrap|ng-dynamic|ngx-toastr|@ng-bootstrap|@ng-select|@kolkov|@ks89)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    }
  }
};