import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { LandingPage } from '../pages/landing.page';
import { ListPage } from '../pages/list.page';

/**
 * Test credentials for E2E tests
 * Note: These should be configured in environment variables for production
 */
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'testpassword'
};

/**
 * Extended test fixtures with page objects
 */
type TestFixtures = {
  loginPage: LoginPage;
  landingPage: LandingPage;
  listPage: ListPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await use(landingPage);
  },

  listPage: async ({ page }, use) => {
    const listPage = new ListPage(page);
    await use(listPage);
  },
});

export { expect } from '@playwright/test';
