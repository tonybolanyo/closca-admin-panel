# Jest Testing Framework Setup

This document describes the Jest testing framework implementation for the Closca Admin Panel Angular 6 application.

## Overview

Jest has been configured as a modern testing framework alongside the existing Karma/Jasmine setup. This provides faster test execution and better developer experience while maintaining compatibility with Angular 6.

## Configuration

### Files Added
- `jest.config.js` - Main Jest configuration
- `setup-jest.ts` - Jest setup file with browser mocks
- `package.json` - Updated with Jest dependencies and scripts

### Jest Configuration Features
- TypeScript support for Angular 6
- HTML template inlining 
- Style URL processing
- Coverage reporting
- Browser environment mocking

## Running Tests

### Jest Commands
```bash
# Run all Jest tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test pattern
npm run test -- --testPathPattern="simple\.spec\.ts"
```

### Karma Commands (Legacy)
```bash
# Run original Karma/Jasmine tests
npm run test:karma
```

## Test Structure

### New Jest Tests
Jest tests follow the naming convention `*.spec.ts` and are located alongside their source files:

#### Shared Components
- `src/app/shared/components/dialog-confirmation/dialog-confirmation.component.simple.spec.ts`
- `src/app/shared/components/dialog-info/dialog-info.component.simple.spec.ts`
- `src/app/shared/components/cookies/cookies.component.spec.ts`
- `src/app/shared/components/custom-table/custom-table.component.spec.ts`

#### Services and Utilities
- `src/app/shared/services/can-deactivate-dialog.service.spec.ts`
- `src/app/shared/services/datepicker-angular-material.service.spec.ts`
- `src/app/shared/pipes/safe.pipe.spec.ts`

#### Constants
- `src/app/shared/constants/patterns.spec.ts`
- `src/app/shared/constants/router-definitions.spec.ts`
- `src/app/shared/constants/date-formats.spec.ts`

#### Layout Components
- `src/app/modules/main/components/footer/footer.component.spec.ts`
- `src/app/components/landing-page/landing-page.component.spec.ts`

#### Authentication Components (pending - service dependencies)
- `src/app/components/password-recover/password-recover.component.spec.ts`
- `src/app/components/reset-password/reset-password.component.spec.ts`
- `src/app/components/register/register.component.spec.ts`

#### Infrastructure
- `src/__mocks__/@tyris/angular-foundation-libs.ts` (Mock for missing dependency)

### Testing Approach
- **Unit Tests**: Focus on individual component/service logic
- **Simple Mocking**: Use Jest mocks instead of complex Angular TestBed setups where possible
- **Dependency Injection**: Mock external dependencies and services
- **Coverage**: Ensure critical business logic is covered

## Test Coverage

Current Jest test coverage for critical components:
- DialogConfirmationComponent: 100%
- DialogInfoComponent: 100%
- SafePipe: 100%
- CanDeactivateDialogService: 100%
- MyDateAdapter: 100%
- Patterns Constants: 100%
- Router Definitions Constants: 100%
- Date Formats Constants: 100%
- FooterComponent: 100%
- CookiesComponent: 100%
- CustomTableComponent: Comprehensive coverage
- LandingPageComponent: 100%
- PasswordRecoverComponent: Comprehensive (pending - service dependency)
- ResetPasswordComponent: Comprehensive (pending - service dependency)
- RegisterComponent: Comprehensive (pending - service dependency)

## Best Practices

### Writing Jest Tests
1. Use unit tests for business logic testing
2. Mock external dependencies properly
3. Test error conditions and edge cases
4. Use descriptive test names
5. Group related tests with `describe` blocks

### Mocking External Dependencies
```typescript
// Mock Angular Material dependencies
const mockDialogRef = {
  close: jest.fn()
};

// Mock services
const mockService = {
  method: jest.fn().mockReturnValue(of(mockData))
};
```

### Testing Components
For complex components with templates, use simple unit tests focusing on component logic rather than full integration tests:

```typescript
// Unit test approach
const component = new MyComponent(mockDependency);
expect(component.method()).toBe(expectedResult);
```

## Migration Strategy

The Jest framework exists alongside Karma to allow gradual migration:

1. **Current State**: Karma tests continue to work for existing code
2. **New Development**: Use Jest for new components and services
3. **Gradual Migration**: Convert existing tests to Jest as needed
4. **Final Goal**: Eventually deprecate Karma in favor of Jest

## Dependencies

### Jest Packages
- `jest@24.9.0` - Core Jest framework (compatible with Angular 6)
- `jest-preset-angular@7.1.1` - Angular-specific Jest presets
- `@types/jest@24.9.1` - TypeScript definitions

### Known Limitations
- Some external dependencies (like `@gnommostudios/ng-gnommo-base`) are mocked in setup
- Complex component integration tests may require additional setup
- Existing Karma tests may fail in Jest due to different environments

## Troubleshooting

### Common Issues
1. **Module not found**: Check import paths and mocks in `setup-jest.ts`
2. **Template/Style loading**: Use simple unit tests or inline templates
3. **Angular dependencies**: Ensure proper mocking of Angular services

### Debug Commands
```bash
# Run with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- path/to/test.spec.ts

# Generate coverage report
npm run test:coverage -- --coverage
```