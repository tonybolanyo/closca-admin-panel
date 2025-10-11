import { test, expect } from '../fixtures/test-fixtures';

/**
 * Landing Page Tests
 * Tests for the welcome/landing page
 */
test.describe('Landing Page', () => {
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.goto();
  });

  test('should display landing page elements', async ({ landingPage }) => {
    // Verify landing page elements are visible
    await expect(landingPage.logo).toBeVisible();
    await expect(landingPage.welcomeTitle).toBeVisible();
    await expect(landingPage.enterButton).toBeVisible();
  });

  test('should display welcome message', async ({ landingPage, page }) => {
    // Verify welcome title contains expected text
    await expect(landingPage.welcomeTitle).toContainText('Bienvenido');
  });

  test('should have clickable enter button', async ({ landingPage }) => {
    // Verify enter button is enabled
    await expect(landingPage.enterButton).toBeEnabled();
  });

  test('should display Closca logo', async ({ landingPage }) => {
    // Verify logo is present
    const logoSrc = await landingPage.logo.getAttribute('src');
    expect(logoSrc).toContain('logo');
  });

  test.skip('should navigate to login when clicking enter', async ({ landingPage, page }) => {
    // Note: This test depends on authentication state and routing behavior
    // Skip if not authenticated
    
    await landingPage.clickEnter();
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Verify navigation occurred
    // The actual behavior depends on whether user is authenticated
    const url = page.url();
    expect(url).toMatch(/\/(login|admin)/);
  });
});
