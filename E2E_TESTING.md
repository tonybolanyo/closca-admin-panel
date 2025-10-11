# End-to-End Testing with Playwright

This document describes the end-to-end testing setup using Playwright for the Closca Admin Panel application.

## Overview

The E2E tests use [Playwright](https://playwright.dev/), a modern testing framework that provides reliable cross-browser testing capabilities. Tests are located in the `e2e-playwright/` directory.

## Test Structure

```
e2e-playwright/
├── fixtures/           # Test fixtures and helpers
│   ├── auth.setup.ts  # Authentication setup
│   └── test-fixtures.ts # Custom test fixtures
├── pages/             # Page Object Models
│   ├── base.page.ts   # Base page class
│   ├── landing.page.ts # Landing page
│   ├── list.page.ts   # Generic list/table page
│   └── login.page.ts  # Login page
└── tests/             # Test specifications
    ├── fountains.spec.ts # Fountain CRUD tests
    ├── landing.spec.ts   # Landing page tests
    ├── login.spec.ts     # Login flow tests
    └── navigation.spec.ts # Navigation tests
```

## Setup and Installation

### 1. Install Playwright

Playwright is already installed as a dev dependency. If you need to reinstall:

```bash
npm install --save-dev @playwright/test --legacy-peer-deps
```

### 2. Install Browsers

Install the required browsers (Chromium is recommended):

```bash
npx playwright install chromium
```

To install all browsers:

```bash
npx playwright install
```

### 3. Install System Dependencies (Linux only)

On Linux systems, you may need to install additional dependencies:

```bash
npx playwright install-deps
```

## Running Tests

### Run All Tests

```bash
npm run e2e:playwright
```

### Run Tests in UI Mode (Interactive)

```bash
npm run e2e:playwright:ui
```

This opens the Playwright UI where you can:
- See all tests
- Run tests selectively
- Watch test execution
- Debug failures

### Run Tests in Headed Mode (See Browser)

```bash
npm run e2e:playwright:headed
```

### Debug Tests

```bash
npm run e2e:playwright:debug
```

This opens the Playwright Inspector for step-by-step debugging.

### Run Specific Test File

```bash
npx playwright test login.spec.ts
```

### Run Tests Matching a Pattern

```bash
npx playwright test --grep "login"
```

## Test Configuration

The test configuration is defined in `playwright.config.ts`:

- **Base URL**: `http://localhost:4200`
- **Browser**: Chromium (default)
- **Parallel Execution**: Enabled (disabled on CI)
- **Retries**: 2 on CI, 0 locally
- **Timeout**: Default test timeout is 30 seconds
- **Web Server**: Automatically starts `npm start` before tests

### Environment Variables

Configure test credentials using environment variables:

```bash
export TEST_USER_EMAIL="your-test-user@example.com"
export TEST_USER_PASSWORD="your-test-password"
```

For Windows:
```bash
set TEST_USER_EMAIL=your-test-user@example.com
set TEST_USER_PASSWORD=your-test-password
```

Or create a `.env` file in the project root:
```
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-password
```

## Page Object Model Pattern

Tests use the Page Object Model (POM) pattern to:
- Encapsulate page interactions
- Improve test maintainability
- Reduce code duplication
- Make tests more readable

### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MyPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('[data-testid="my-element"]');
  }

  async performAction() {
    await this.myElement.click();
  }
}
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-route');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    // Act
    // Assert
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Using Page Objects

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password');
    await expect(loginPage.page).toHaveURL(/.*admin.*/);
  });
});
```

## Test Data Attributes

To make tests more reliable and maintainable, use `data-testid` attributes in HTML elements:

### Adding Test IDs to Components

```html
<!-- Before -->
<button class="btn btn-primary">Submit</button>

<!-- After -->
<button class="btn btn-primary" data-testid="submit-button">Submit</button>
```

### Using Test IDs in Tests

```typescript
// Using the base page helper
await basePage.clickByTestId('submit-button');

// Or directly
await page.locator('[data-testid="submit-button"]').click();
```

## Critical Test Paths

The following critical paths are covered by E2E tests:

### 1. Authentication Flow
- Login page display
- Form validation
- Successful login
- Failed login
- Logout

### 2. Navigation
- Landing page
- Route redirects
- Invalid routes
- Menu navigation

### 3. Fountains Management (CRUD)
- List fountains
- Search fountains
- Create fountain
- Edit fountain
- Delete fountain
- View fountain details

### 4. Users Management
- List users
- Create user
- Edit user
- Deactivate user

### 5. Corporates Management
- List corporates
- Create corporate
- Edit corporate
- View corporate details

## Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run e2e:playwright:report
```

The report includes:
- Test results
- Screenshots of failures
- Videos of test execution (on failure)
- Trace files for debugging

### JSON Report

Test results are also saved in JSON format at:
```
playwright-report/test-results.json
```

## Continuous Integration

### Running on CI

Tests are configured to run on CI with:
- Serial execution (not parallel)
- 2 retry attempts
- Automatic web server startup
- Screenshots and videos on failure

### CI Configuration Example (GitHub Actions)

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Run E2E tests
        run: npm run e2e:playwright
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

### 1. Use Reliable Selectors
- Prefer `data-testid` attributes
- Avoid CSS classes that may change
- Use semantic HTML where possible

### 2. Wait for Elements Properly
```typescript
// Good
await expect(element).toBeVisible();

// Avoid
await page.waitForTimeout(1000); // Only use as last resort
```

### 3. Keep Tests Independent
- Each test should be able to run in isolation
- Don't rely on test execution order
- Clean up test data if needed

### 4. Use Fixtures
- Encapsulate common setup in fixtures
- Share page objects via fixtures
- Handle authentication in setup files

### 5. Make Tests Readable
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Add comments for complex logic

### 6. Handle Asynchronous Operations
- Use `await` for all async operations
- Use `expect` for assertions (they auto-wait)
- Avoid arbitrary timeouts

## Troubleshooting

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check network conditions
- Verify application is running

### Browser Not Found
```bash
npx playwright install chromium
```

### Authentication Fails
- Verify test credentials are set
- Check if user exists in test database
- Review auth.setup.ts logic

### Element Not Found
- Verify selector is correct
- Check if element is visible
- Use Playwright Inspector to debug

## Debugging Tips

### 1. Use Playwright Inspector
```bash
npm run e2e:playwright:debug
```

### 2. Take Screenshots
```typescript
await page.screenshot({ path: 'debug.png' });
```

### 3. Enable Verbose Logging
```typescript
test.use({ trace: 'on' });
```

### 4. Pause Test Execution
```typescript
await page.pause();
```

## Extending Tests

### Adding New Test Files

1. Create file in `e2e-playwright/tests/`
2. Import test fixtures
3. Write tests using page objects
4. Run and verify

### Adding New Page Objects

1. Create file in `e2e-playwright/pages/`
2. Extend `BasePage`
3. Define locators as class properties
4. Add interaction methods
5. Use in tests via fixtures

### Adding Data Test IDs

When adding test IDs to templates:

1. Identify critical UI elements
2. Add `data-testid` attribute
3. Use descriptive, kebab-case names
4. Document in component

Example:
```html
<!-- Fountains List -->
<button 
  data-testid="fountain-new-button"
  (click)="createFountain()">
  New Fountain
</button>

<table data-testid="fountains-table">
  <!-- table content -->
</table>
```

## Test Coverage

Current E2E test coverage includes:

- ✅ Login page display and validation
- ✅ Landing page
- ✅ Basic navigation
- ✅ Route redirects
- ⏳ Fountains CRUD (requires authentication)
- ⏳ Users management (requires authentication)
- ⏳ Corporates management (requires authentication)

**Note**: Tests marked with ⏳ are implemented but skipped by default as they require valid authentication credentials. Configure `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` to run these tests.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
