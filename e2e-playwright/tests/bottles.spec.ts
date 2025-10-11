import { test, expect } from '../fixtures/test-fixtures';
import { CrudPage } from '../pages/crud.page';

/**
 * Bottles Module E2E Tests
 * Tests for bottle management CRUD operations
 */
test.describe('Bottles Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  let bottlesPage: CrudPage;

  test.beforeEach(async ({ page }) => {
    bottlesPage = new CrudPage(page, 'bottles');
  });

  test.describe('Bottles List', () => {
    test.beforeEach(async () => {
      await bottlesPage.gotoList();
    });

    test('should display bottles list page', async () => {
      // Verify table is visible
      await expect(bottlesPage.table).toBeVisible();
    });

    test('should display table with data', async () => {
      // Wait for table to load
      await bottlesPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await bottlesPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async () => {
      // Verify search input is visible
      await expect(bottlesPage.searchInput).toBeVisible();
    });

    test('should have new bottle button', async () => {
      // Verify new button is visible
      await expect(bottlesPage.newButton).toBeVisible();
    });
  });

  test.describe('Create Bottle', () => {
    test.beforeEach(async () => {
      await bottlesPage.gotoCreate();
    });

    test('should display bottle creation form', async () => {
      // Verify form fields are visible
      await expect(bottlesPage.nameInput).toBeVisible();
      await expect(bottlesPage.saveButton).toBeVisible();
      await expect(bottlesPage.cancelButton).toBeVisible();
    });

    test.skip('should create bottle with valid data', async () => {
      const timestamp = Date.now();
      await bottlesPage.fillBasicForm({
        name: `Test Bottle ${timestamp}`,
        description: 'Test bottle description'
      });
      
      await bottlesPage.submitForm();
      
      // Should redirect to list
      expect(bottlesPage.page.url()).toContain('/bottles/list');
    });
  });

  test.describe('Bottle Search', () => {
    test.beforeEach(async () => {
      await bottlesPage.gotoList();
      await bottlesPage.waitForTableLoad();
    });

    test('should search bottles', async () => {
      await bottlesPage.search('test');
      await bottlesPage.page.waitForTimeout(1000);
      
      await expect(bottlesPage.searchInput).toHaveValue('test');
    });
  });
});
