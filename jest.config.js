module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,ts}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,ts}'
  ],
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
  transformIgnorePatterns: [
    'node_modules/(?!@angular|@ngrx|ngx-bootstrap|ng-dynamic)'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      allowJs: true
    }
  }
};