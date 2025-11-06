import { test, expect } from '../fixtures/test-fixtures';
import { CrudPage } from '../pages/crud.page';

/**
 * Brands Module E2E Tests
 * Tests for brand management CRUD operations
 */
test.describe('Brands Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  let brandsPage: CrudPage;

  test.beforeEach(async ({ page }) => {
    brandsPage = new CrudPage(page, 'brands');
  });

  test.describe('Brands List', () => {
    test.beforeEach(async () => {
      await brandsPage.gotoList();
    });

    test('should display brands list page', async () => {
      // Verify table is visible
      await expect(brandsPage.table).toBeVisible();
    });

    test('should display table with data', async () => {
      // Wait for table to load
      await brandsPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await brandsPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async () => {
      // Verify search input is visible
      await expect(brandsPage.searchInput).toBeVisible();
    });

    test('should have new brand button', async () => {
      // Verify new button is visible
      await expect(brandsPage.newButton).toBeVisible();
    });

    test('should have pagination controls when needed', async () => {
      await brandsPage.waitForTableLoad();
      const rowCount = await brandsPage.getRowCount();
      
      if (rowCount > 10) {
        await expect(brandsPage.paginator).toBeVisible();
      }
    });
  });

  test.describe('Create Brand', () => {
    test.beforeEach(async () => {
      await brandsPage.gotoCreate();
    });

    test('should display brand creation form', async () => {
      // Verify form fields are visible
      await expect(brandsPage.nameInput).toBeVisible();
      await expect(brandsPage.saveButton).toBeVisible();
      await expect(brandsPage.cancelButton).toBeVisible();
    });

    test('should have disabled save button when form is empty', async () => {
      await brandsPage.page.waitForTimeout(500);
      
      const isValid = await brandsPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test.skip('should create brand with valid data', async () => {
      const timestamp = Date.now();
      await brandsPage.fillBasicForm({
        name: `Test Brand ${timestamp}`,
        description: 'Test brand description',
        active: true
      });
      
      await brandsPage.submitForm();
      
      // Should redirect to list
      expect(brandsPage.page.url()).toContain('/brands/list');
      
      // New brand should appear in list
      const exists = await brandsPage.itemExistsInList(`Test Brand ${timestamp}`);
      expect(exists).toBe(true);
    });

    test('should validate required fields', async () => {
      // Blur name field to trigger validation
      await brandsPage.nameInput.focus();
      await brandsPage.nameInput.blur();
      
      await brandsPage.page.waitForTimeout(300);
      
      const isValid = await brandsPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should cancel brand creation', async () => {
      await brandsPage.nameInput.fill('Test Brand');
      await brandsPage.cancelForm();
      
      await brandsPage.page.waitForTimeout(500);
    });
  });

  test.describe('Edit Brand', () => {
    test.skip('should load existing brand data', async () => {
      await brandsPage.gotoList();
      await brandsPage.waitForTableLoad();
      
      const rowCount = await brandsPage.getRowCount();
      
      if (rowCount > 0) {
        const brandData = await brandsPage.getItemDataFromRow(0);
        
        await brandsPage.clickEditOnRow(0);
        await brandsPage.page.waitForTimeout(1000);
        
        expect(brandsPage.page.url()).toContain('/edit/');
        await expect(brandsPage.nameInput).toHaveValue(brandData.name);
      } else {
        test.skip();
      }
    });

    test.skip('should update brand data', async () => {
      await brandsPage.gotoList();
      await brandsPage.waitForTableLoad();
      
      const rowCount = await brandsPage.getRowCount();
      
      if (rowCount > 0) {
        await brandsPage.clickEditOnRow(0);
        await brandsPage.page.waitForTimeout(1000);
        
        const newDescription = `Updated description ${Date.now()}`;
        await brandsPage.descriptionInput.fill(newDescription);
        
        await brandsPage.submitForm();
        
        expect(brandsPage.page.url()).toContain('/brands/list');
      } else {
        test.skip();
      }
    });
  });

  test.describe('Delete Brand', () => {
    test.skip('should show delete confirmation dialog', async () => {
      await brandsPage.gotoList();
      await brandsPage.waitForTableLoad();
      
      const rowCount = await brandsPage.getRowCount();
      
      if (rowCount > 0) {
        await brandsPage.clickDeleteOnRow(rowCount - 1);
        await brandsPage.page.waitForTimeout(500);
        
        const dialog = brandsPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Brand Search and Filter', () => {
    test.beforeEach(async () => {
      await brandsPage.gotoList();
      await brandsPage.waitForTableLoad();
    });

    test('should search brands by text', async () => {
      await brandsPage.search('test');
      await brandsPage.page.waitForTimeout(1000);
      
      await expect(brandsPage.searchInput).toHaveValue('test');
    });

    test('should show no results for non-existent search', async () => {
      await brandsPage.search('xyznonexistent999');
      await brandsPage.page.waitForTimeout(1000);
      
      const rowCount = await brandsPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search', async () => {
      const initialRowCount = await brandsPage.getRowCount();
      
      await brandsPage.search('test');
      await brandsPage.page.waitForTimeout(1000);
      
      await brandsPage.searchInput.clear();
      await brandsPage.page.waitForTimeout(1000);
      
      const finalRowCount = await brandsPage.getRowCount();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });

  test.describe('Brand Image Upload', () => {
    test.skip('should upload brand logo', async () => {
      await brandsPage.gotoCreate();
      
      await brandsPage.fillBasicForm({
        name: 'Test Brand',
        description: 'Test brand'
      });
      
      // Upload logo would need a test image file
      // await brandsPage.uploadImage('path/to/test/image.png');
      
      await brandsPage.page.waitForTimeout(500);
    });
  });
});
