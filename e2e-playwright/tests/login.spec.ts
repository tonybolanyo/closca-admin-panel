import { test, expect } from '../fixtures/test-fixtures';

/**
 * Login Page Tests
 * Tests for the authentication flow
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display login form', async ({ loginPage }) => {
    // Verify login form is visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.logo).toBeVisible();
  });

  test('should have disabled login button when form is empty', async ({ loginPage }) => {
    // Verify button is disabled initially
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(false);
  });

  test('should enable login button when form is filled', async ({ loginPage }) => {
    // Fill in the form
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.passwordInput.fill('password123');
    
    // Verify button is enabled
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(true);
  });

  test('should show validation for invalid email', async ({ loginPage, page }) => {
    // Fill in invalid email
    await loginPage.emailInput.fill('invalid-email');
    await loginPage.emailInput.blur();
    
    // The button should remain disabled due to validation
    const isEnabled = await loginPage.isLoginButtonEnabled();
    expect(isEnabled).toBe(false);
  });

  test.skip('should login successfully with valid credentials', async ({ loginPage, page }) => {
    // Note: This test is skipped by default as it requires valid credentials
    // To run this test, set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables
    
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    
    if (!email || !password) {
      test.skip();
    }
    
    await loginPage.login(email!, password!);
    
    // Wait for redirect to admin panel
    await page.waitForURL('**/admin/**', { timeout: 10000 });
    
    // Verify successful login
    await expect(page).toHaveURL(/.*admin.*/);
  });

  test.skip('should show error message for invalid credentials', async ({ loginPage, page }) => {
    // Note: This test is skipped by default as it depends on backend behavior
    
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    // Wait for error message (adjust selector based on actual implementation)
    await page.waitForTimeout(2000);
    
    // Verify error message is shown
    // This depends on how your app shows error messages
    // Example: await expect(page.locator('.error-message')).toBeVisible();
  });
});
