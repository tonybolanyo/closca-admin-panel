# E2E Tests Quick Reference

This directory contains Playwright end-to-end tests for the Closca Admin Panel.

## Quick Start

```bash
# Install Playwright browsers
npx playwright install chromium

# Run all tests
npm run e2e:playwright

# Run tests in UI mode
npm run e2e:playwright:ui

# Run tests with visible browser
npm run e2e:playwright:headed

# Debug tests
npm run e2e:playwright:debug
```

## Directory Structure

- **fixtures/** - Test fixtures and authentication setup
- **pages/** - Page Object Models for UI components
- **tests/** - Test specifications

## Running Specific Tests

```bash
# Run a specific test file
npx playwright test login.spec.ts

# Run tests by name
npx playwright test --grep "login"

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Environment Setup

Create a `.env` file or set environment variables:

```bash
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=your-test-password
```

## Documentation

See [E2E_TESTING.md](../E2E_TESTING.md) for comprehensive documentation.

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/`
2. Import fixtures: `import { test, expect } from '../fixtures/test-fixtures';`
3. Write your tests using page objects
4. Run and verify: `npm run e2e:playwright`

## Adding Test IDs

When adding test IDs to templates, use the `data-testid` attribute:

```html
<button data-testid="my-button">Click me</button>
```

Then in your tests:
```typescript
await page.getByTestId('my-button').click();
```

## Debugging Failed Tests

1. Run in debug mode: `npm run e2e:playwright:debug`
2. View screenshots in `playwright-report/`
3. Check trace files for detailed execution
4. Use `await page.pause()` to pause execution

## Test Reports

After running tests:
```bash
npm run e2e:playwright:report
```

This opens the HTML report with:
- Test results
- Screenshots
- Videos
- Trace files
