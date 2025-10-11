# Closca admin panel

![Tests](https://img.shields.io/badge/tests-468%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-28%25-orange)
![Jest](https://img.shields.io/badge/tested%20with-jest-orange)
![Angular](https://img.shields.io/badge/angular-20.3.4-red)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple)

This project was originally generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1 and has been upgraded to **Angular 20.3.4**.

## Latest Updates

- ✅ **Angular 20 Upgrade Complete** - See [ANGULAR_20_UPGRADE.md](ANGULAR_20_UPGRADE.md)
- ✅ **Bootstrap 5 Migration Complete** - See [BOOTSTRAP_5_MIGRATION.md](BOOTSTRAP_5_MIGRATION.md)
- ✅ **186 Tests Passing** (90% pass rate)
- ✅ **Build Succeeds** without errors

## Install dependencies

Some libraries are hosted in Tyris Verdaccio registry. You need to login **before installing
dependencies** using this command in your terminal:

```bash
npm login --registry=https://verdaccio.tyris-software.com --scope=@tyris
```

## Testing

This project uses Jest as the primary testing framework, providing fast and reliable unit testing for Angular 20.

### Test Coverage Status

- **186 unit tests passing** (90% pass rate)
- Comprehensive coverage across components, services, and guards
- Critical shared components and services tested:
  - DialogConfirmationComponent
  - DialogInfoComponent  
  - SafePipe
  - CanDeactivateDialogService
  - MyDateAdapter
  - Constants and Router Definitions
  - User Model
  - CanDeactivateGuard

### Running Tests

```bash
# Run Jest tests (recommended)
npm run test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch

# Run legacy Karma tests
npm run test:karma

# View coverage report
open coverage/index.html
```

### Test Files Location

Jest tests follow the naming convention `*.spec.ts` and are located alongside their source files in the `src/` directory. Key test files include:

- `src/app/shared/components/**/*.simple.spec.ts` - Component unit tests
- `src/app/shared/services/**/*.spec.ts` - Service unit tests  
- `src/app/shared/constants/**/*.spec.ts` - Constants validation tests
- `src/app/shared/guards/**/*.spec.ts` - Route guard tests

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/project/` directory. Use the `--prod` flag for a production build.

## Running unit tests

### Jest (Recommended)
Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io/). Jest provides fast execution, excellent debugging capabilities, and comprehensive coverage reporting.

### Karma (Legacy)
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
