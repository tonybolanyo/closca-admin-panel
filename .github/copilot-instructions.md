# Copilot Instructions for Closca Admin Panel

## Project Overview

This is an Angular 10 admin panel for managing Closca water bottle fountains and corporate accounts. The application was originally built with Angular 6 and has been upgraded to Angular 10.

## Technology Stack

- **Framework**: Angular 10.2.5
- **Language**: TypeScript 4.0.8
- **Testing**: Jest (primary), Karma (legacy)
- **Styling**: SCSS with Bootstrap 4
- **Build Tool**: Angular CLI 10.2.4
- **Node Version**: Node.js 20 (requires `--openssl-legacy-provider` flag)

## Key Dependencies

- **UI Components**: Angular Material 10.2.7, ng-bootstrap 7.0.0
- **Maps**: @agm/core for Google Maps integration
- **Charts**: ng-apexcharts
- **Image Gallery**: @ks89/angular-modal-gallery
- **Rich Text Editor**: @kolkov/angular-editor
- **Private Libraries**: @tyris/angular-foundation (local file dependency)

## Build and Development Commands

```bash
# Install dependencies (requires Verdaccio login first)
npm login --registry=https://verdaccio.tyris-software.com --scope=@tyris
npm install

# Development server (runs on http://localhost:4200/)
npm start
# or
ng serve

# Production build
npm run build-prod

# Development builds
npm run build-develop
npm run build-pre
```

## Testing

The project uses **Jest** as the primary testing framework:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Legacy Karma tests
npm run test:karma
```

### Test File Conventions

- Test files use the `*.spec.ts` naming convention
- Tests are located alongside their source files
- Component tests: `src/app/**/components/**/*.spec.ts`
- Service tests: `src/app/**/services/**/*.spec.ts`
- Guard tests: `src/app/shared/guards/**/*.spec.ts`

### Test Coverage

- Current coverage: 12% overall
- 65 unit tests passing
- 100% coverage on critical shared components and services

## Code Style and Linting

```bash
# Run linter
npm run lint
```

- Follow Angular style guide conventions
- Use TypeScript strict type checking
- SCSS for component styles
- Use Angular Material components where possible

## Project Structure

```
src/
├── app/
│   ├── components/          # Standalone components (landing, auth pages)
│   ├── models/             # Data models
│   ├── modules/
│   │   └── main/
│   │       ├── components/  # Main layout (header, footer)
│   │       └── modules/
│   │           └── panel/   # Admin panel modules
│   │               └── modules/
│   │                   ├── corporates/
│   │                   ├── fountains/
│   │                   └── users/
│   └── shared/
│       ├── components/      # Reusable components
│       ├── constants/       # App constants
│       ├── guards/         # Route guards
│       ├── pipes/          # Custom pipes
│       └── services/       # Shared services
├── assets/                 # Static assets
├── environments/           # Environment configs
└── sass/                   # Global SCSS files
```

## Important Patterns and Conventions

### Component Creation

Use Angular CLI for scaffolding:
```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

### Forms

- Use Reactive Forms (FormGroup, FormControl)
- Implement form validation with Angular validators
- Use Angular Material form controls (mat-form-field, mat-input)

### Routing

- Lazy-loaded modules for performance
- Route guards for authentication and authorization
- Nested routing for panel sections

### Services

- Injectable services with providedIn: 'root'
- Base service pattern from @tyris/angular-foundation
- HTTP interceptors for authentication (JWT tokens)

### Styling

- Component-specific SCSS files
- Global styles in `src/styles.scss`
- Bootstrap 4 grid system
- Angular Material theming

## Special Considerations

### Private Dependencies

The project uses `@tyris/angular-foundation` library which is:
- Hosted on a private Verdaccio registry
- Locally referenced via `file:./libs/angular-foundation`
- Requires login before `npm install`
- Has mock implementations in `src/__mocks__/@tyris/angular-foundation.ts` for testing

### Node.js Compatibility

Due to Angular 10 and Node.js 20 compatibility:
- All build commands use `NODE_OPTIONS=--openssl-legacy-provider`
- This is configured in package.json scripts

### Testing Mocks

Mock implementations exist for:
- External libraries in `src/__mocks__/`
- Styles (CSS/SCSS) for Jest
- @tyris/angular-foundation for unit tests

## Common Tasks

### Adding a New Feature Module

1. Generate the module: `ng generate module modules/feature-name`
2. Add routing configuration
3. Create components within the module
4. Update parent routing to lazy-load the module
5. Add navigation links in the appropriate menu

### Adding a New Component

1. Generate component: `ng generate component path/component-name`
2. Create corresponding test file: `component-name.component.spec.ts`
3. Import in parent module
4. Add routing if needed
5. Write unit tests

### Working with Forms

1. Import ReactiveFormsModule in the module
2. Create FormGroup in component
3. Add form controls with validators
4. Bind to template with formControlName
5. Handle form submission

### API Integration

1. Create/update service in `shared/services/`
2. Extend BaseService from @tyris/angular-foundation
3. Define API endpoints in environment files
4. Use HTTP interceptors (already configured)
5. Handle responses with RxJS operators

## Documentation Files

Reference these files for additional context:
- `README.md` - Project overview and basic commands
- `ANGULAR_10_UPGRADE.md` - Angular 10 upgrade details
- `ANGULAR_8_UPGRADE.md` - Angular 8 upgrade history
- `JEST_TESTING.md` - Jest configuration details
- `TEST_COVERAGE_SUMMARY.md` - Test coverage status
- `libs/README.md` - Private library management

## Best Practices

1. **Always run tests** before committing changes
2. **Write unit tests** for new components and services
3. **Use TypeScript types** - avoid `any` type
4. **Follow the existing patterns** in similar components
5. **Keep components focused** - single responsibility
6. **Use services for business logic** - not in components
7. **Lazy-load feature modules** for better performance
8. **Use Angular Material** components for consistency
9. **Handle errors** properly with try-catch and error interceptors
10. **Document complex logic** with comments

## Debugging

- Use Chrome DevTools for browser debugging
- Angular DevTools extension for component inspection
- `console.log()` is acceptable for development
- Jest watch mode for test-driven development
- Source maps are enabled for debugging TypeScript

## Migration Notes

This project has been through multiple Angular upgrades:
- Originally Angular 6
- Upgraded to Angular 8 (documented in ANGULAR_8_UPGRADE.md)
- Currently on Angular 10 (documented in ANGULAR_10_UPGRADE.md)

Be aware of:
- ViewChild/ContentChild static timing requirements
- Angular Material import path changes
- RxJS 6 migration patterns (rxjs-compat included)
- Template syntax changes from earlier versions
