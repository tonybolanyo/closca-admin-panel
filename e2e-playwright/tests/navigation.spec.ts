import { test, expect } from '../fixtures/test-fixtures';

/**
 * Navigation Tests
 * Tests for basic application navigation and routing
 */
test.describe('Navigation', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify redirect to admin
    await expect(page).toHaveURL(/.*admin.*/);
  });

  test('should redirect to admin from root', async ({ page }) => {
    await page.goto('/');
    
    // Verify redirect to admin
    await page.waitForURL('**/admin', { timeout: 5000 });
    
    expect(page.url()).toContain('admin');
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    
    // Verify login page elements
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="password"]')).toBeVisible();
  });

  test('should handle invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    // Verify redirect to admin (based on wildcard route)
    await page.waitForURL('**/admin', { timeout: 5000 });
    
    expect(page.url()).toContain('admin');
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page title
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
